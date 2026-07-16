import { getCheckoutProvider } from '@/lib/checkout';
import { buildOrder } from '@/lib/checkout/buildOrder';
import { saveOrder } from '@/lib/orders';
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

    const orderId = `NV${Date.now()}${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0')}`;

    // Fiyat, kargo ve stok burada yeniden hesaplanır.
    const built = buildOrder(items, customer, orderId);
    if (!built.ok) {
      return NextResponse.json({ error: built.error }, { status: 400 });
    }

    await saveOrder(built.order, 'pending');

    const provider = getCheckoutProvider();
    const result = await provider.createPayment(built.order);

    return NextResponse.json(result);
  } catch (err) {
    console.error('[/api/checkout]', err);
    return NextResponse.json({ error: 'Ödeme başlatılamadı.' }, { status: 500 });
  }
}
