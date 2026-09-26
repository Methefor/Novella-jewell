export const TEST_PRODUCT_IDS: readonly string[] = ['presales-live-payment-test-v1'];

export type FunnelEvent = {
  sessionId: string;
  eventName: string;
  path: string;
  productId: string | null;
  source: string;
};

export type FunnelOrder = {
  orderNo: string;
  total: number;
  productIds: string[];
};

export function isTestOrder(order: FunnelOrder, excludedOrderNos: readonly string[] = []): boolean {
  if (excludedOrderNos.includes(order.orderNo)) return true;
  return order.productIds.some((id) => TEST_PRODUCT_IDS.includes(id));
}

/** Admin panelinde gezen oturumlar (kurucu/ekip) müşteri trafiği sayılmaz. */
export function internalSessionIds(events: readonly FunnelEvent[]): Set<string> {
  return new Set(events.filter((e) => e.path.startsWith('/admin')).map((e) => e.sessionId));
}

const STEPS = ['view_item', 'add_to_cart', 'begin_checkout'] as const;

/**
 * Her adım "bu adıma veya daha ileri bir adıma ulaşan benzersiz oturum" sayısıdır;
 * bu yüzden huni hiçbir zaman artmaz ve %100'ü aşamaz. Sepet localStorage'da
 * kaldığı için oturum sepete ekleme olayı olmadan ödemeye gelebilir.
 */
export function buildFunnel(events: readonly FunnelEvent[]) {
  const sessions = new Set(events.map((e) => e.sessionId));
  const reached = STEPS.map(() => new Set<string>());
  for (const e of events) {
    const index = STEPS.indexOf(e.eventName as (typeof STEPS)[number]);
    if (index < 0) continue;
    for (let i = 0; i <= index; i += 1) reached[i].add(e.sessionId);
  }
  return {
    sessions: sessions.size,
    viewItem: reached[0].size,
    addToCart: reached[1].size,
    beginCheckout: reached[2].size,
  };
}

export function cleanEvents<T extends FunnelEvent>(events: readonly T[]): T[] {
  const internal = internalSessionIds(events);
  return events.filter((e) => !internal.has(e.sessionId) && !(e.productId && TEST_PRODUCT_IDS.includes(e.productId)));
}
