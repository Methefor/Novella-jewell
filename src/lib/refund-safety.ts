import { and, eq, isNull, or } from 'drizzle-orm';
import { orders } from '@/db/schema';
import { PayTRRefundRejectedError } from '@/lib/checkout/paytr';

export function refundClaimCondition(orderId: string) {
  return and(eq(orders.id, orderId), or(isNull(orders.refundStatus), eq(orders.refundStatus, 'failed')));
}

export function refundFailureStatus(error: unknown): 'failed' | 'review' {
  return error instanceof PayTRRefundRejectedError ? 'failed' : 'review';
}
