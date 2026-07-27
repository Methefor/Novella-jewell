import { db, dbYok } from '@/db';
import { orders } from '@/db/schema';
import { getAdminAuth } from '@/lib/admin-auth';
import { and, desc, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

function csvCell(value: unknown) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

export async function GET(request: NextRequest) {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') {
    return NextResponse.json({ error: 'Yetkisiz işlem.' }, { status: 403 });
  }
  if (dbYok) {
    return NextResponse.json({ error: 'Veritabanı bağlantısı yok.' }, { status: 503 });
  }

  const payment = request.nextUrl.searchParams.get('payment');
  const fulfillment = request.nextUrl.searchParams.get('fulfillment');
  const query = request.nextUrl.searchParams.get('q')?.trim().toLocaleLowerCase('tr-TR') ?? '';
  const date = request.nextUrl.searchParams.get('date');
  const conditions = [];
  if (payment && payment !== 'all') conditions.push(eq(orders.status, payment));
  if (fulfillment && fulfillment !== 'all') conditions.push(eq(orders.fulfillmentStatus, fulfillment));
  const rows = await db
    .select()
    .from(orders)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(orders.createdAt));
  const dateLimit =
    date === '7'
      ? Date.now() - 7 * 86_400_000
      : date === '30'
        ? Date.now() - 30 * 86_400_000
        : 0;
  const filtered = rows.filter((order) => {
    if (dateLimit && new Date(order.createdAt).getTime() < dateLimit) return false;
    if (!query) return true;
    return [order.orderNo, order.customer.adSoyad, order.customer.email, order.customer.telefon, order.trackingNumber ?? '']
      .some((value) => value.toLocaleLowerCase('tr-TR').includes(query));
  });
  const header = ['Sipariş No', 'Tarih', 'Ödeme', 'Operasyon', 'Müşteri', 'E-posta', 'Telefon', 'İl', 'İlçe', 'Toplam', 'Kargo', 'Takip No', 'Ürünler', 'Operasyon Notu'];
  const lines = [
    header.map(csvCell).join(','),
    ...filtered.map((order) =>
      [
        order.orderNo,
        new Date(order.createdAt).toISOString(),
        order.status,
        order.fulfillmentStatus,
        order.customer.adSoyad,
        order.customer.email,
        order.customer.telefon,
        order.customer.il,
        order.customer.ilce,
        order.total,
        order.carrier,
        order.trackingNumber,
        order.items.map((item) => `${item.ad} x ${item.adet}`).join(' | '),
        order.operationNote,
      ].map(csvCell).join(',')
    ),
  ];

  return new NextResponse(`\uFEFF${lines.join('\r\n')}`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="novella-siparisler-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
