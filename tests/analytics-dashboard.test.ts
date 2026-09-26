import { test } from 'node:test';
import assert from 'node:assert/strict';
import { averagePerDay, dailySeries, periodDelta, sourceLabel, sourceRows, type DatedEvent } from '../src/lib/analytics-dashboard';

const at = (iso: string, sessionId: string, eventName = 'page_view', source = 'direct'): DatedEvent => ({
  sessionId, eventName, path: '/', productId: null, source, occurredAt: new Date(iso),
});

test('dailySeries buckets by Istanbul day, counts distinct sessions and fills empty days', () => {
  const now = new Date('2026-09-10T12:00:00Z');
  const events = [
    at('2026-09-10T08:00:00Z', 'a'), at('2026-09-10T09:00:00Z', 'a'), at('2026-09-10T09:30:00Z', 'b', 'begin_checkout'),
    at('2026-09-08T09:00:00Z', 'c'),
  ];
  const series = dailySeries(events, 3, now);
  assert.deepEqual(series.map((p) => p.key), ['2026-09-08', '2026-09-09', '2026-09-10']);
  assert.deepEqual(series.map((p) => p.visitors), [1, 0, 2]);
  assert.deepEqual(series.map((p) => p.checkouts), [0, 0, 1]);
});

test('a late-night UTC event lands on the next Istanbul day', () => {
  const series = dailySeries([at('2026-09-09T22:30:00Z', 'a')], 2, new Date('2026-09-10T12:00:00Z'));
  assert.equal(series[1].key, '2026-09-10');
  assert.equal(series[1].visitors, 1);
});

test('instagram and facebook referrers are merged into one label each', () => {
  assert.equal(sourceLabel('l.instagram.com'), 'Instagram');
  assert.equal(sourceLabel('ig'), 'Instagram');
  assert.equal(sourceLabel('lm.facebook.com'), 'Facebook');
  assert.equal(sourceLabel('www.google.com'), 'Google');
  assert.equal(sourceLabel('direct'), 'Direkt');
  const rows = sourceRows([at('2026-09-10T08:00:00Z', 'a', 'page_view', 'ig'), at('2026-09-10T08:00:00Z', 'b', 'page_view', 'l.instagram.com'), at('2026-09-10T08:00:00Z', 'c')]);
  assert.deepEqual(rows, [{ label: 'Instagram', sessions: 2 }, { label: 'Direkt', sessions: 1 }]);
});

test('periodDelta never divides by zero', () => {
  assert.deepEqual(periodDelta(5, 0), { pct: null, direction: 'none' });
  assert.deepEqual(periodDelta(0, 0), { pct: null, direction: 'flat' });
  assert.equal(periodDelta(15, 10).direction, 'up');
  assert.equal(periodDelta(5, 10).pct, -50);
});

test('averagePerDay handles empty input', () => {
  assert.equal(averagePerDay([]), 0);
  assert.equal(averagePerDay([{ key: 'a', label: 'a', visitors: 2, checkouts: 0 }, { key: 'b', label: 'b', visitors: 4, checkouts: 0 }]), 3);
});
