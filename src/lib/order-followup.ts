import 'server-only';
import { db } from '@/db';
import { orders, orderEvents } from '@/db/schema';
import { and, asc, eq, inArray, isNotNull, isNull, lt, or, sql } from 'drizzle-orm';
import { markOrderPaid } from './orders';
import { amountInCents, queryPayTRStatus, type PayTRStatus } from './checkout/paytr-status';
import { buildOrderStatusEmail } from './email';
import { drainEmailOutbox, enqueueEmail } from './email-outbox';

export function matchingCompletedRefund(result: PayTRStatus, reference: string | null, amount: string | null) {
  return result.state === 'paid' && !!reference && amount !== null && result.refunds.some((item) =>
    item.reference === reference && item.amount === amountInCents(amount) && !!item.completedAt);
}

/** Only called after checkout-owner/admin verification, or by the protected worker. */
export async function reconcileOrder(orderNo: string, includeCompleted = false): Promise<void> {
  const now = new Date();
  const [order] = await db.update(orders).set({ providerCheckedAt: now })
    .where(and(eq(orders.orderNo, orderNo),
      or(eq(orders.status, 'pending'), inArray(orders.refundStatus, ['submitted', 'review']), includeCompleted ? eq(orders.status, 'paid') : undefined),
      isNotNull(orders.paymentReadyAt),
      or(isNull(orders.providerCheckedAt), lt(orders.providerCheckedAt, new Date(now.getTime() - 60_000)))
    )).returning();
  if (!order) return;
  let note: string;
  try {
    const result = await queryPayTRStatus(order.orderNo, order.total);
    if (result.state === 'unknown') {
      note = 'Kesin sonuç henüz yok. Rezervasyon korunuyor; başarısız bildirim veya PayTR incelemesi bekleniyor.';
    } else if (order.status === 'pending') {
      const paid = await markOrderPaid(order.orderNo);
      note = paid.ok ? 'Ödeme PayTR durum sorgusuyla doğrulandı.' : 'Ödeme bulundu ancak siparişe işlenemedi; inceleme gerekli.';
    } else if (order.refundStatus === 'submitted' && matchingCompletedRefund(result, order.refundReference, order.refundAmount)) {
      await completeRefund(order.id);
      note = 'İade referansı, tutarı ve banka tamamlanma kaydı doğrulandı.';
    } else if (order.refundStatus === 'success') {
      note = matchingCompletedRefund(result, order.refundReference, order.refundAmount)
        ? 'Ödeme ve eşleşen tamamlanmış banka iade kaydı PayTR üzerinden doğrulandı.'
        : 'Ödeme doğrulandı. Eski iade kaydının ayrıntısını PayTR panelinden kontrol edin.';
    } else if (!order.refundStatus || order.refundStatus === 'failed') {
      note = 'Ödeme PayTR üzerinden doğrulandı.';
    } else {
      note = order.refundStatus === 'review'
        ? 'Belirsiz iade: PayTR kaydı ve fiziksel stok yönetici tarafından uzlaştırılmalı. Yeni iade gönderilmedi.'
        : 'İade kabul edildi; eşleşen banka tamamlanma kaydı henüz yok.';
    }
  } catch (error) {
    // Our query throws fixed messages, never provider payload/card details.
    note = error instanceof Error && error.message.startsWith('PayTR') ? error.message : 'Sonuç kaydedilemedi; inceleme gerekli.';
  }
  await db.update(orders).set({ providerCheckNote: note }).where(and(eq(orders.id, order.id), eq(orders.providerCheckedAt, now)));
}

export async function completeRefund(orderId: string, database = db) {
  return database.transaction(async (tx) => {
    const [row] = await tx.update(orders).set({ refundStatus: 'success', refundedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(orders.id, orderId), eq(orders.refundStatus, 'submitted'))).returning();
    if (!row) return false;
    await tx.insert(orderEvents).values({ orderId, eventType: 'refund', fromValue: 'submitted', toValue: 'success', note: 'PayTR banka tamamlanma kaydı doğrulandı.', createdBy: 'system:reconciliation' });
    await enqueueEmail(tx, row.id, 'refund_completed', `${row.orderNo}/refund-completed`, buildOrderStatusEmail(row, true));
    return true;
  });
}

/** Bounded batches; DB claims make overlapping cron/admin runs safe. */
export async function runOrderFollowup() {
  const candidates = await db.select({ orderNo: orders.orderNo }).from(orders)
    .where(or(and(eq(orders.status, 'pending'), isNotNull(orders.paymentReadyAt)), eq(orders.refundStatus, 'submitted')))
    .orderBy(asc(sql`coalesce(${orders.providerCheckedAt}, ${orders.createdAt})`)).limit(8);
  for (const order of candidates) await reconcileOrder(order.orderNo);
  const emailsAttempted = await drainEmailOutbox(8);
  return { checkedOrders: candidates.length, emailsAttempted };
}
