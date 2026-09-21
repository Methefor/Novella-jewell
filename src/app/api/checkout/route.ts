import { getCheckoutProvider } from '@/lib/checkout';
import { buildOrder } from '@/lib/checkout/buildOrder';
import { CatalogProductMissingError, createPendingOrder, markOrderFailed, markPaymentReady } from '@/lib/orders';
import { StockUnavailableError } from '@/lib/checkout/stock-reservation';
import { CatalogUnavailableError } from '@/lib/catalog';
import { createLegalAcceptance } from '@/lib/create-legal-acceptance';
import { LEGAL_VERSION } from '@/lib/legal';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db, dbYok } from '@/db';
import { orders } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { CHECKOUT_COOKIE, CHECKOUT_COOKIE_MAX_AGE, readCheckoutSession, sealCheckoutSession } from '@/lib/checkout/session';
import { checkoutStatusResponse } from '@/lib/checkout/status-response';
import { reconcileOrder } from '@/lib/order-followup';
import { drainEmailOutbox } from '@/lib/email-outbox';
import { after } from 'next/server';
import { RECEIPT_COOKIE, receiptCookieOptions, sealReceipt } from '@/lib/checkout/receipt';

const noStore = { 'Cache-Control': 'no-store, private' };
const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/api/checkout', maxAge: CHECKOUT_COOKIE_MAX_AGE };

/** Only the signed owner cookie can recover a payment; an email or order number cannot. */
async function resumeCheckout(req: NextRequest): Promise<NextResponse | null> {
  const session = readCheckoutSession(req.cookies.get(CHECKOUT_COOKIE)?.value, process.env.PAYTR_MERCHANT_KEY ?? '');
  if (!session) return null;
  if (dbYok) return NextResponse.json({ error: 'Sipariş durumu şu anda kontrol edilemiyor.' }, { status: 503, headers: noStore });
  let [order] = await db.select({ id: orders.id, status: orders.status, total: orders.total }).from(orders)
    .where(and(eq(orders.orderNo, session.orderNo), eq(orders.randomNr, session.verify))).limit(1);
  if (!order) return null;
  if (order.status === 'pending') {
    await reconcileOrder(session.orderNo);
    [order] = await db.select({ id: orders.id, status: orders.status, total: orders.total }).from(orders).where(eq(orders.id, order.id)).limit(1);
  }
  if (order.status === 'paid') after(async () => { await drainEmailOutbox(2, order.id); });
  const response = NextResponse.json(checkoutStatusResponse(order, session), { headers: noStore });
  if (order.status === 'paid') response.cookies.set(RECEIPT_COOKIE, sealReceipt(session.orderNo, session.verify, process.env.PAYTR_MERCHANT_KEY ?? ''), receiptCookieOptions);
  if (order.status === 'failed' || order.status === 'paid') {
    response.cookies.set(CHECKOUT_COOKIE, '', { ...cookieOptions, maxAge: 0 });
  }
  // PayTR consumes the iframe token on its first opening. Reloading that URL
  // produces an invalid-payment page. Keep the reservation and show its status;
  // never mint another payment while the previous provider outcome is unknown.
  return response;
}

export async function GET(req: NextRequest) {
  try {
    return await resumeCheckout(req) ?? NextResponse.json({ type: 'none' }, { headers: noStore });
  } catch {
    return NextResponse.json({ error: 'Devam eden ödemeniz kontrol edilemedi. Lütfen yeniden deneyin.' }, { status: 503, headers: noStore });
  }
}

/**
 * Client'tan kabul ettiğimiz TEK şey: ne istediği + kime gönderileceği + onaylar.
 * Fiyat/kargo/toplam sunucuda hesaplanır. expectedTotal yalnızca müşterinin
 * gördüğü tutarın değişmediğini doğrulamak içindir; fiyat kaynağı değildir.
 * Bkz. src/lib/checkout/buildOrder.ts
 */
const customerSchema = z.object({
  name: z.string().trim().min(2).max(60),
  surname: z.string().trim().min(2).max(60),
  email: z.string().trim().email().max(120),
  phone: z.string().trim().min(10).max(20),
  address: z.string().trim().min(10).max(400),
  city: z.string().trim().min(2).max(60),
  district: z.string().trim().min(2).max(60),
  note: z.string().trim().max(500).optional(),
});

const bodySchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        variantId: z.string().min(1),
        quantity: z.number().int().min(1).max(20),
        customization: z.string().max(60).optional(),
      })
    )
    .min(1),
  customer: customerSchema,
  expectedTotal: z.number().finite().nonnegative(),
  // Mesafeli Sözleşmeler Yönetmeliği m.6: ön bilgilendirmenin teyidi zorunlu.
  // Onay olmadan sözleşme kurulmamış sayılır, bu yüzden sunucuda da şart koşuyoruz.
  consent: z.object({
    version: z.literal(LEGAL_VERSION),
    sozlesme: z.literal(true),
    kvkk: z.literal(true),
  }),
});

export async function POST(req: NextRequest) {
  let pendingOrderNo: string | undefined;
  try {
    const resumed = await resumeCheckout(req);
    if (resumed) return resumed;
    const parsed = bodySchema.safeParse(await req.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Sipariş bilgileri eksik veya sözleşme sürümü güncellenmiş. Sayfayı yenileyip bilgilerinizi kontrol edin.' },
        { status: 400 }
      );
    }

    const { items, customer } = parsed.data;

    // random_nr güvenli sipariş doğrulama bağlantısında kullanılmak üzere
    // pending siparişle birlikte kaydedilir.
    const randomNr = crypto.randomBytes(24).toString('hex');

    // Fiyat, kargo ve stok burada yeniden hesaplanır. id geçici — birazdan
    // DB'nin ürettiği order_no ile değiştirilecek.
    const built = await buildOrder(items, customer, '');
    if (!built.ok) {
      return NextResponse.json({ error: built.error }, { status: 400 });
    }
    if (Math.round(parsed.data.expectedTotal * 100) !== Math.round(built.order.total * 100)) {
      return NextResponse.json({ error: 'Sepetinizdeki fiyat veya kargo bedeli güncellendi. Sayfayı yenileyerek yeni toplamı kontrol edin.' }, { status: 409 });
    }

    // PayTR gibi sağlayıcılar müşteri IP'si ister. Vercel/Next.js
    // header'larından gerçek IP'yi almaya çalışır, bulamazsa placeholder kalır.
    const forwarded = req.headers.get('x-forwarded-for');
    const userIp = forwarded
      ? (forwarded.split(',')[0]?.trim() ?? '127.0.0.1')
      : (req.headers.get('x-real-ip') ?? '127.0.0.1');
    built.order.userIp = userIp;

    // Pending siparişi DB'ye yaz; DB order_no (NJ-2026-0001) üretir.
    const pending = await createPendingOrder(built.order, randomNr, createLegalAcceptance(built.order));
    if (!pending) {
      // DATABASE_URL yoksa sipariş kaydedilemez → ödeme başlatma (kargo
      // gönderilemeyecek bir sipariş almaktansa hata döndürmek daha güvenli).
      return NextResponse.json(
        { error: 'Sipariş sistemi şu anda hazır değil, lütfen sonra deneyin.' },
        { status: 503 }
      );
    }

    // order_no → PayTR merchant_oid. Callback bu numarayla kaydı bulacak.
    built.order.id = pending.orderNo;
    pendingOrderNo = pending.orderNo;

    const provider = getCheckoutProvider();
    const result = await provider.createPayment(built.order, randomNr);
    if (!await markPaymentReady(pending.orderNo)) {
      throw new Error('Payment session expired before it was opened');
    }

    const response = NextResponse.json({ ...result, orderNo: pending.orderNo, total: built.order.total }, { headers: noStore });
    if (result.type === 'iframe') {
      response.cookies.set(CHECKOUT_COOKIE, sealCheckoutSession({
        orderNo: pending.orderNo, verify: randomNr, iframeUrl: result.iframeUrl, issuedAt: Date.now(),
      }, process.env.PAYTR_MERCHANT_KEY ?? ''), cookieOptions);
    }
    return response;
  } catch (err) {
    // No iframe has been returned: the customer cannot pay this session.
    // If cleanup fails, the unissued reservation expires safely after 5 minutes.
    if (pendingOrderNo) {
      try { await markOrderFailed(pendingOrderNo); }
      catch { console.error('[/api/checkout] Unissued reservation cleanup failed', { orderNo: pendingOrderNo }); }
    }
    if (err instanceof StockUnavailableError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    if (err instanceof CatalogUnavailableError) {
      return NextResponse.json({ error: 'Ürünlerimiz şu anda doğrulanamıyor. Lütfen birkaç dakika sonra tekrar deneyin.' }, { status: 503 });
    }
    if (err instanceof CatalogProductMissingError) {
      return NextResponse.json({ error: 'Sepetinizdeki bir ürün artık satışta değil. Sepetinizi güncelleyip tekrar deneyin.' }, { status: 409 });
    }
    console.error('[/api/checkout]', err);
    return NextResponse.json(
      { error: 'Ödeme başlatılamadı.' },
      { status: 500 }
    );
  }
}
