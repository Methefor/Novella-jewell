import { db, dbYok } from '@/db';
import { orders } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { reconcileOrder } from '@/lib/order-followup';
import { RECEIPT_COOKIE, readReceipt } from '@/lib/checkout/receipt';

const querySchema = z.object({
  orderNo: z.string().trim().regex(/^NJ-\d{4}-\d+$/),
  verify: z.string().trim().min(16).max(200),
});

/**
 * PayTR müşteri dönüşü callback'ten önce gelebilir. Başarı ekranı bu uç
 * noktadan siparişin veritabanında gerçekten paid olduğunu doğrular.
 * randomNr, sıralı sipariş numarasının tahmin edilerek sorgulanmasını engeller.
 */
export async function GET(request: NextRequest) {
  if (dbYok) {
    return NextResponse.json({ status: 'unavailable' }, { status: 503 });
  }

  const url = new URL(request.url);
  const receipt = readReceipt(request.cookies.get(RECEIPT_COOKIE)?.value, process.env.PAYTR_MERCHANT_KEY ?? '');
  const parsed = querySchema.safeParse({
    orderNo: url.searchParams.get('orderNo'),
    verify: receipt?.orderNo === url.searchParams.get('orderNo') ? receipt.verify : url.searchParams.get('verify'),
  });
  if (!parsed.success) {
    return NextResponse.json({ status: 'invalid' }, { status: 400 });
  }

  let [order] = await db
    .select({
      status: orders.status,
      total: orders.total,
      items: orders.items,
    })
    .from(orders)
    .where(
      and(
        eq(orders.orderNo, parsed.data.orderNo),
        eq(orders.randomNr, parsed.data.verify)
      )
    )
    .limit(1);

  if (!order) {
    return NextResponse.json({ status: 'not_found' }, { status: 404 });
  }
  if (order.status === 'pending') {
    await reconcileOrder(parsed.data.orderNo);
    [order] = await db.select({ status: orders.status, total: orders.total, items: orders.items }).from(orders).where(and(eq(orders.orderNo, parsed.data.orderNo), eq(orders.randomNr, parsed.data.verify))).limit(1);
  }

  return NextResponse.json(
    {
      status: order.status,
      total: order.status === 'paid' ? order.total : null,
      items: order.status === 'paid' ? order.items.map(({ productId, variantId, ad, adet, birimFiyat }) => ({ productId, variantId, ad, adet, birimFiyat })) : [],
    },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
