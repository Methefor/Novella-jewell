import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildFunnel, cleanEvents, isTestOrder, type FunnelEvent } from '../src/lib/analytics-funnel';

const ev = (sessionId: string, eventName: string, extra: Partial<FunnelEvent> = {}): FunnelEvent => ({
  sessionId, eventName, path: '/', productId: null, source: 'direct', ...extra,
});

test('funnel counts distinct sessions and never increases', () => {
  const events = [
    ev('a', 'page_view'), ev('a', 'view_item'), ev('a', 'view_item'), ev('a', 'add_to_cart'), ev('a', 'begin_checkout'), ev('a', 'begin_checkout'),
    ev('b', 'page_view'), ev('b', 'begin_checkout'),
    ev('c', 'page_view'),
  ];
  assert.deepEqual(buildFunnel(events), { sessions: 3, viewItem: 2, addToCart: 2, beginCheckout: 2 });
});

test('admin sessions and test-product events are excluded', () => {
  const events = [
    ev('owner', 'page_view', { path: '/admin/analitik' }), ev('owner', 'view_item'),
    ev('x', 'view_item', { productId: 'presales-live-payment-test-v1' }),
    ev('y', 'view_item', { productId: 'real-1' }),
  ];
  assert.deepEqual(cleanEvents(events).map((e) => e.sessionId), ['y']);
});

test('test orders are detected by product or explicit order number', () => {
  assert.equal(isTestOrder({ orderNo: 'NJ-2026-0009', total: 99.9, productIds: ['presales-live-payment-test-v1'] }), true);
  assert.equal(isTestOrder({ orderNo: 'NJ-2026-0001', total: 98.9, productIds: [] }, ['NJ-2026-0001']), true);
  assert.equal(isTestOrder({ orderNo: 'NJ-2026-0100', total: 749, productIds: ['p1'] }), false);
});
