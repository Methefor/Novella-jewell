import { timingSafeEqual } from 'node:crypto';
import { runOrderFollowup } from '@/lib/order-followup';
import { NextResponse } from 'next/server';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const actual = Buffer.from(request.headers.get('authorization') ?? '');
  const expected = Buffer.from(`Bearer ${secret ?? ''}`);
  if (!secret || actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  return NextResponse.json(await runOrderFollowup(), { headers: { 'Cache-Control': 'no-store' } });
}
