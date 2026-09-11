/** A consumed PayTR token must never be returned by a status/reload request. */
export function checkoutStatusResponse(order: { status: string; total: string | number }, owner: { orderNo: string; verify: string }) {
  if (order.status === 'failed') return { type: 'none' as const, previousFailed: true };
  if (order.status === 'paid') return {
    type: 'redirect' as const,
    redirectUrl: `/odeme/sonuc?status=success&orderNo=${encodeURIComponent(owner.orderNo)}`,
  };
  return { type: 'pending' as const, orderNo: owner.orderNo, total: Number(order.total) };
}
