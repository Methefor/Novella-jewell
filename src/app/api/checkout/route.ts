import { getCheckoutProvider } from '@/lib/checkout';
import { buildOrder } from '@/lib/checkout/buildOrder';
import { createPendingOrder } from '@/lib/orders';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Client'tan kabul ettiğimiz TEK şey: ne istediği + kime gönderileceği + onaylar.
 * Fiyat/kargo/toplam alanları bilerek yok — hepsi sunucuda hesaplanır.
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
  // Mesafeli Sözleşmeler Yönetmeliği m.6: ön bilgilendirmenin teyidi zorunlu.
  // Onay olmadan sözleşme kurulmamış sayılır, bu yüzden sunucuda da şart koşuyoruz.
  consent: z.object({
    sozlesme: z.literal(true),
    kvkk: z.literal(true),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = bodySchema.safeParse(await req.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Sipariş bilgileri eksik veya geçersiz.' },
        { status: 400 }
      );
    }

    const { items, customer } = parsed.data;

    // random_nr'ı burada üretiyoruz: aynı değer hem DB pending siparişe
    // kaydedilecek hem de Shopier imzasında kullanılacak (tek kaynak).
    const randomNr = String(Math.floor(Math.random() * 900000) + 100000);

    // Fiyat, kargo ve stok burada yeniden hesaplanır. id geçici — birazdan
    // DB'nin ürettiği order_no ile değiştirilecek.
    const built = buildOrder(items, customer, '');
    if (!built.ok) {
      return NextResponse.json({ error: built.error }, { status: 400 });
    }

    // Pending siparişi DB'ye yaz; DB order_no (NJ-2026-0001) üretir.
    const pending = await createPendingOrder(built.order, randomNr);
    if (!pending) {
      // DATABASE_URL yoksa sipariş kaydedilemez → ödeme başlatma (kargo
      // gönderilemeyecek bir sipariş almaktansa hata döndürmek daha güvenli).
      return NextResponse.json(
        { error: 'Sipariş sistemi şu anda hazır değil, lütfen sonra deneyin.' },
        { status: 503 }
      );
    }

    // order_no → Shopier platform_order_id. Callback bu numarayla kaydı bulacak.
    built.order.id = pending.orderNo;

    const provider = getCheckoutProvider();
    const result = await provider.createPayment(built.order, randomNr);

    return NextResponse.json(result);
  } catch (err) {
    console.error('[/api/checkout]', err);
    return NextResponse.json({ error: 'Ödeme başlatılamadı.' }, { status: 500 });
  }
}
