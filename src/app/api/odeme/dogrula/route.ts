import { db, dbYok } from '@/db';
import { orders } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const querySchema = z.object({
  orderNo: z.string().trim().regex(/^NJ-\d{4}-\d+$/),
  verify: z.string().trim().min(16).max(200),
});

/**
 * PayTR müşteri dönüşü callback'ten önce gelebilir. Başarı ekranı bu uç
 * noktadan siparişin veritabanında gerçekten paid olduğunu doğrular.
 * randomNr, sıralı sipariş numarasının tahmin edilerek sorgulanmasını engeller.
 */
export async function GET(request: Request) {
  if (dbYok) {
    return NextResponse.json({ status: 'unavailable' }, { status: 503 });
  }

  const url = new URL(request.url);
  const parsed = querySchema.safeParse({
    orderNo: url.searchParams.get('orderNo'),
    verify: url.searchParams.get('verify'),
  });
  if (!parsed.success) {
    return NextResponse.json({ status: 'invalid' }, { status: 400 });
  }

  const [order] = await db
    .select({
      status: orders.status,
      total: orders.total,
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

  return NextResponse.json(
    {
      status: order.status,
      total: order.status === 'paid' ? order.total : null,
    },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
