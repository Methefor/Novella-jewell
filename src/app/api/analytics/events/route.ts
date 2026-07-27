import { db, dbYok } from '@/db';
import { analyticsEvents } from '@/db/schema';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const eventSchema = z.object({
  sessionId: z.string().uuid(),
  eventName: z.enum(['page_view', 'view_item', 'add_to_cart', 'begin_checkout']),
  productId: z.string().max(160).nullable().optional(),
  value: z.number().min(0).max(1_000_000).nullable().optional(),
  path: z.string().startsWith('/').max(500),
  source: z.string().trim().min(1).max(120),
  medium: z.string().trim().min(1).max(120),
  campaign: z.string().trim().max(160).nullable().optional(),
  referrerHost: z.string().trim().max(255).nullable().optional(),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).default({}),
  occurredAt: z.string().datetime(),
});

export async function POST(request: Request) {
  if (dbYok) return new NextResponse(null, { status: 204 });
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > 12_000) {
    return NextResponse.json({ error: 'İstek çok büyük.' }, { status: 413 });
  }
  const parsed = eventSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Geçersiz analitik olayı.' }, { status: 400 });
  }
  const input = parsed.data;
  await db.insert(analyticsEvents).values({
    ...input,
    value: input.value == null ? null : input.value.toFixed(2),
    occurredAt: new Date(input.occurredAt),
  });
  return new NextResponse(null, {
    status: 204,
    headers: { 'Cache-Control': 'no-store' },
  });
}
