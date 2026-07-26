import { db, dbYok } from '@/db';
import { orders } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Sipariş takip sorgusu — sipariş no + e-posta ikilisi doğrulanmadan
// hiçbir bilgi dönmez (başkasının siparişi görüntülenemez).
const schema = z.object({
  orderNo: z
    .string()
    .trim()
    .regex(/^NJ-?\d{4}-?\d+$/i, 'Geçersiz sipariş numarası'),
  email: z.string().trim().email('Geçerli bir e-posta girin'),
});

/** Sipariş durumunu müşteri diline çevirir. */
const DURUMLAR: Record<string, { etiket: string; aciklama: string }> = {
  pending: {
    etiket: 'Ödeme bekleniyor',
    aciklama: 'Ödemeniz henüz tamamlanmadı. Tamamlandığında hazırlığa başlarız.',
  },
  paid: {
    etiket: 'Hazırlanıyor',
    aciklama:
      'Ödemeniz alındı, siparişiniz özenle paketleniyor. Kargoya verildiğinde e-posta ile bilgilendirileceksiniz.',
  },
  failed: {
    etiket: 'Ödeme başarısız',
    aciklama:
      'Ödeme tamamlanamadı. Tekrar deneyebilir veya bizimle iletişime geçebilirsiniz.',
  },
};

const TESLIMAT_DURUMLARI: Record<
  string,
  { etiket: string; aciklama: string }
> = {
  new: DURUMLAR.paid,
  preparing: DURUMLAR.paid,
  shipped: {
    etiket: 'Kargoya verildi',
    aciklama: 'Siparişiniz yola çıktı. Kargo takip bilgileri e-posta adresinize gönderildi.',
  },
  delivered: {
    etiket: 'Teslim edildi',
    aciklama: 'Siparişiniz teslim edildi. Güzel günlerde kullanmanızı dileriz.',
  },
  cancelled: {
    etiket: 'İptal edildi',
    aciklama: 'Siparişiniz iptal edildi. Ayrıntılar için bizimle iletişime geçebilirsiniz.',
  },
  returned: {
    etiket: 'İade işlemi',
    aciklama: 'İade işleminiz kaydedildi. Süreç hakkında e-posta ile bilgilendirileceksiniz.',
  },
};

export async function POST(req: Request) {
  if (dbYok) {
    return NextResponse.json(
      { error: 'Sipariş sorgulama şu anda kullanılamıyor, lütfen sonra deneyin.' },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Geçersiz istek.' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Geçersiz istek.' },
      { status: 400 }
    );
  }

  // Kullanıcı "NJ20260001" de yazabilir — DB formatına normalize et.
  const ham = parsed.data.orderNo.toUpperCase();
  const m = /^NJ-?(\d{4})-?(\d+)$/.exec(ham);
  const orderNo = m ? `NJ-${m[1]}-${m[2]}` : ham;

  const [row] = await db
    .select({
      orderNo: orders.orderNo,
      status: orders.status,
      fulfillmentStatus: orders.fulfillmentStatus,
      items: orders.items,
      total: orders.total,
      customer: orders.customer,
      createdAt: orders.createdAt,
      paidAt: orders.paidAt,
    })
    .from(orders)
    .where(eq(orders.orderNo, orderNo))
    .limit(1);

  if (
    !row ||
    row.customer.email.toLowerCase() !== parsed.data.email.toLowerCase()
  ) {
    return NextResponse.json(
      { error: 'Bu bilgilerle eşleşen sipariş bulunamadı.' },
      { status: 404 }
    );
  }

  const durum =
    row.status === 'paid'
      ? (TESLIMAT_DURUMLARI[row.fulfillmentStatus] ?? DURUMLAR.paid)
      : (DURUMLAR[row.status] ?? DURUMLAR.pending);

  return NextResponse.json({
    orderNo: row.orderNo,
    durum: durum.etiket,
    aciklama: durum.aciklama,
    items: row.items.map((i) => ({ ad: i.ad, adet: i.adet })),
    total: row.total,
    createdAt: row.createdAt,
    paidAt: row.paidAt,
  });
}
