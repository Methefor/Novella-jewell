import { db, dbYok } from '@/db';
import { orders } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { RECEIPT_COOKIE, receiptCookieOptions, sealReceipt } from '@/lib/checkout/receipt';
import { SITE } from '@/lib/config';

/** Exchange the private bank-return reference for an HttpOnly cookie before
 * rendering a storefront page or loading third-party measurement scripts. */
export async function GET(request: NextRequest) {
  const orderNo = request.nextUrl.searchParams.get('orderNo') ?? '';
  const verify = request.nextUrl.searchParams.get('verify') ?? '';
  if (dbYok || !/^NJ-\d{4}-\d+$/.test(orderNo) || !/^[a-f0-9]{48}$/.test(verify)) return new NextResponse('Invalid reference', { status: 400 });
  const [row] = await db.select({ id: orders.id }).from(orders).where(and(eq(orders.orderNo, orderNo), eq(orders.randomNr, verify))).limit(1);
  if (!row) return new NextResponse('Not found', { status: 404 });
  const response = NextResponse.redirect(new URL(`/odeme/sonuc?status=success&orderNo=${encodeURIComponent(orderNo)}`, SITE.url));
  response.cookies.set(RECEIPT_COOKIE, sealReceipt(orderNo, verify, process.env.PAYTR_MERCHANT_KEY ?? ''), receiptCookieOptions);
  response.headers.set('Cache-Control', 'no-store, private');
  response.headers.set('Referrer-Policy', 'no-referrer');
  return response;
}
