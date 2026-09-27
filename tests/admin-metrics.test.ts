import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeOrderMetrics, isRealSale, type MetricOrder } from '../src/lib/admin-metrics';

const order = (over: Partial<MetricOrder> = {}): MetricOrder => ({
  orderNo: 'NJ-2026-0100', status: 'paid', fulfillmentStatus: 'new', refundStatus: null, total: '749.00',
  createdAt: new Date('2026-09-25T10:00:00Z'), items: [{ productId: 'p1', ad: 'Bileklik', adet: 1, birimFiyat: 749 }], ...over,
});

test('test, refunded and unpaid orders are not real sales', () => {
  assert.equal(isRealSale(order()), true);
  assert.equal(isRealSale(order({ status: 'pending' })), false);
  assert.equal(isRealSale(order({ refundStatus: 'success' })), false);
  assert.equal(isRealSale(order({ fulfillmentStatus: 'returned' })), false);
  assert.equal(isRealSale(order({ items: [{ productId: 'presales-live-payment-test-v1', ad: 'Test', adet: 1, birimFiyat: 50 }] })), false);
  assert.equal(isRealSale(order({ orderNo: 'NJ-2026-0001', items: [] })), false);
});

test('metrics count only real sales and report what was excluded', () => {
  const now = new Date('2026-09-27T12:00:00Z');
  const metrics = computeOrderMetrics([
    order({ orderNo: 'A', total: '749.00', createdAt: new Date('2026-09-26T10:00:00Z') }),
    order({ orderNo: 'B', total: '500.00', createdAt: new Date('2026-09-10T10:00:00Z'), fulfillmentStatus: 'shipped' }),
    order({ orderNo: 'NJ-2026-0009', total: '99.90', fulfillmentStatus: 'returned', refundStatus: 'success', items: [{ productId: 'presales-live-payment-test-v1', ad: 'Test', adet: 1, birimFiyat: 99.9 }] }),
  ], now);
  assert.equal(metrics.realCount, 2);
  assert.equal(metrics.revenue, 1249);
  assert.equal(metrics.averageOrder, 624.5);
  assert.equal(metrics.excludedCount, 1);
  assert.equal(metrics.weekRevenue, 749);
  assert.equal(metrics.pendingOperations, 2);
  assert.equal(metrics.fulfillment.shipped, 1);
  assert.equal(metrics.daily.length, 14);
  assert.equal(metrics.topProducts[0].quantity, 2);
});

test('empty order list yields zeros, not NaN', () => {
  const metrics = computeOrderMetrics([]);
  assert.equal(metrics.averageOrder, 0);
  assert.equal(metrics.revenue, 0);
  assert.equal(metrics.topProducts.length, 0);
});
