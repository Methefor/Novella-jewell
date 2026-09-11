import 'server-only';
import { randomUUID } from 'node:crypto';
import { db } from '@/db';
import { emailOutbox } from '@/db/schema';
import type { EmailMessage } from './email-message';
import { and, asc, eq, inArray, isNull, lte, or, sql } from 'drizzle-orm';

type Store = Pick<typeof db, 'select' | 'update' | 'insert'>;
type QueuedMessage = typeof emailOutbox.$inferSelect;

export async function enqueueEmail(tx: Pick<Store, 'insert'>, orderId: string, kind: string, dedupeKey: string, payload: EmailMessage | null) {
  if (payload) await tx.insert(emailOutbox).values({ orderId, kind, dedupeKey, payload }).onConflictDoNothing({ target: emailOutbox.dedupeKey });
}

function due(now: Date) {
  return or(
    and(inArray(emailOutbox.status, ['pending', 'retry']), lte(emailOutbox.nextAttemptAt, now)),
    and(eq(emailOutbox.status, 'sending'), lte(emailOutbox.lockedUntil, now))
  );
}

/** Atomically claim a message across callback, admin and cron invocations. */
export async function claimEmail(store: Store = db, now = new Date(), orderId?: string): Promise<QueuedMessage | null> {
  // Resend keeps idempotency keys for 24h. An ambiguous old send must be reviewed,
  // not retried under an expired key. Unattempted messages remain safe to send.
  await store.update(emailOutbox).set({ status: 'review', lease: null, lockedUntil: null, lastError: 'Önceki gönderim belirsiz; Resend kaydını kontrol edin. Güvenli tekrar süresi doldu.' })
    .where(and(due(now), lte(emailOutbox.firstAttemptAt, new Date(now.getTime() - 23 * 3600_000))));
  const [candidate] = await store.select({ id: emailOutbox.id }).from(emailOutbox)
    .where(and(due(now), orderId ? eq(emailOutbox.orderId, orderId) : undefined))
    .orderBy(asc(emailOutbox.nextAttemptAt)).limit(1);
  if (!candidate) return null;
  const [row] = await store.update(emailOutbox).set({
    status: 'sending', lease: randomUUID(), lockedUntil: new Date(now.getTime() + 5 * 60_000),
    firstAttemptAt: sql`coalesce(${emailOutbox.firstAttemptAt}, ${now.toISOString()}::timestamptz)`,
    attempts: sql`${emailOutbox.attempts} + 1`,
  }).where(and(eq(emailOutbox.id, candidate.id), due(now), or(isNull(emailOutbox.firstAttemptAt), sql`${emailOutbox.firstAttemptAt} > ${new Date(now.getTime() - 23 * 3600_000).toISOString()}::timestamptz`))).returning();
  return row ?? null;
}

export async function deliverEmail(message: QueuedMessage, store: Store = db, transport = sendWithResend): Promise<void> {
  const ownLease = and(eq(emailOutbox.id, message.id), eq(emailOutbox.status, 'sending'), eq(emailOutbox.lease, message.lease!));
  try {
    const id = await transport(message.payload, `novella/${message.id}`);
    if (!id) throw new Error('Resend gönderim kimliği dönmedi.');
    await store.update(emailOutbox).set({ status: 'sent', providerId: id, sentAt: new Date(), lease: null, lockedUntil: null, lastError: null }).where(ownLease);
  } catch {
    await store.update(emailOutbox).set({
      status: 'retry', lease: null, lockedUntil: null,
      nextAttemptAt: new Date(Date.now() + Math.min(60, 2 ** Math.min(message.attempts, 6)) * 60_000),
      lastError: 'Gönderim doğrulanamadı. Aynı içerik ve işlem anahtarıyla yeniden denenecek.',
    }).where(ownLease);
  }
}

export async function drainEmailOutbox(limit = 10, orderId?: string) {
  let attempted = 0;
  while (attempted < limit) {
    const message = await claimEmail(db, new Date(), orderId);
    if (!message) break;
    await deliverEmail(message);
    attempted++;
  }
  return attempted;
}

async function sendWithResend(payload: EmailMessage, idempotencyKey: string): Promise<string> {
  if (!process.env.RESEND_API_KEY) throw new Error('E-posta bağlantısı yapılandırılmamış.');
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
    body: JSON.stringify(payload), signal: AbortSignal.timeout(15_000),
  });
  const body = await response.json() as { id?: string };
  if (!response.ok || !body.id) throw new Error('E-posta sağlayıcısı gönderimi doğrulamadı.');
  return body.id;
}
