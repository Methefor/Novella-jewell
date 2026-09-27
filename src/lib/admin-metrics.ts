import { isTestOrder, KNOWN_TEST_ORDER_NOS } from './analytics-funnel';

const DAY_MS = 86_400_000;

export type MetricOrder = {
  orderNo: string;
  status: string;
  fulfillmentStatus: string;
  refundStatus: string | null;
  total: string | number;
  createdAt: Date | string;
  items: { productId?: string; ad: string; adet: number; birimFiyat: number }[];
};

/** Gerçek satış: ödenmiş, test olmayan ve iade edilmemiş sipariş. */
export function isRealSale(order: MetricOrder): boolean {
  if (order.status !== 'paid') return false;
  if (order.refundStatus === 'success' || order.fulfillmentStatus === 'returned') return false;
  return !isTestOrder(
    { orderNo: order.orderNo, total: Number(order.total), productIds: order.items.map((item) => item.productId ?? '') },
    KNOWN_TEST_ORDER_NOS
  );
}

const sum = (orders: readonly MetricOrder[]) => orders.reduce((total, order) => total + Number(order.total), 0);

export function computeOrderMetrics(orders: readonly MetricOrder[], now: Date = new Date()) {
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const sevenDaysAgo = new Date(startOfToday.getTime() - 6 * DAY_MS);
  const fourteenDaysAgo = new Date(startOfToday.getTime() - 13 * DAY_MS);

  const real = orders.filter(isRealSale);
  const createdAt = (order: MetricOrder) => new Date(order.createdAt);
  const currentWeek = real.filter((order) => createdAt(order) >= sevenDaysAgo);
  const previousWeek = real.filter((order) => createdAt(order) >= fourteenDaysAgo && createdAt(order) < sevenDaysAgo);
  const revenue = sum(real);

  const daily = Array.from({ length: 14 }, (_, index) => {
    const start = new Date(fourteenDaysAgo.getTime() + index * DAY_MS);
    const end = new Date(start.getTime() + DAY_MS);
    const dayOrders = real.filter((order) => createdAt(order) >= start && createdAt(order) < end);
    return { date: start, revenue: sum(dayOrders), count: dayOrders.length };
  });

  const sales = new Map<string, { name: string; quantity: number; revenue: number }>();
  for (const order of real) {
    for (const item of order.items) {
      const key = item.productId ?? item.ad;
      const entry = sales.get(key) ?? { name: item.ad, quantity: 0, revenue: 0 };
      entry.quantity += item.adet;
      entry.revenue += item.birimFiyat * item.adet;
      sales.set(key, entry);
    }
  }

  return {
    realCount: real.length,
    revenue,
    averageOrder: real.length ? revenue / real.length : 0,
    weekRevenue: sum(currentWeek),
    weekCount: currentWeek.length,
    previousWeekRevenue: sum(previousWeek),
    previousWeekCount: previousWeek.length,
    pendingOperations: real.filter((order) => !['delivered', 'cancelled', 'returned'].includes(order.fulfillmentStatus)).length,
    fulfillment: {
      preparing: real.filter((order) => order.fulfillmentStatus === 'preparing').length,
      shipped: real.filter((order) => order.fulfillmentStatus === 'shipped').length,
      delivered: real.filter((order) => order.fulfillmentStatus === 'delivered').length,
    },
    excludedCount: orders.filter((order) => order.status === 'paid').length - real.length,
    daily,
    topProducts: [...sales.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 5),
  };
}
