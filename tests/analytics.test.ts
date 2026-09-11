import { test } from 'node:test';
import assert from 'node:assert/strict';
import { trackPurchase } from '../src/lib/analytics';
import { COOKIE_CONSENT_KEY } from '../src/lib/cookies';
import { createGtagQueue } from '../src/lib/gtag-queue';

test('Google commands use the Arguments protocol rather than unconsumed arrays', () => {
  const layer: unknown[] = [];
  const gtag = createGtagQueue(layer);
  gtag('config', 'G-EXAMPLE', { send_page_view: false });
  assert.equal(Object.prototype.toString.call(layer[0]), '[object Arguments]');
  assert.deepEqual(Array.from(layer[0] as IArguments), ['config', 'G-EXAMPLE', { send_page_view: false }]);
});

test('purchase requires consent, retries absent tags and deduplicates each platform', () => {
  const storage = new Map<string, string>();
  const events: unknown[][] = [];
  const w = {
    localStorage: { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value) },
    location: { origin: 'https://example.invalid', pathname: '/odeme/sonuc' },
    gtag: undefined as ((...args: unknown[]) => void) | undefined,
    fbq: undefined as ((...args: unknown[]) => void) | undefined,
  };
  Object.defineProperty(globalThis, 'window', { value: w, configurable: true });
  const purchase = { total: 409.9, items: [{ productId: 'p1', variantId: 'gold', ad: 'Test', adet: 2, birimFiyat: 180 }] };
  try {
    trackPurchase('NJ-2026-001', purchase);
    assert.equal(events.length, 0);
    storage.set(COOKIE_CONSENT_KEY, 'accepted');
    trackPurchase('NJ-2026-001', purchase);
    assert.equal(storage.has('novella_ga_purchase_NJ-2026-001'), false);
    w.gtag = (...args) => events.push(args);
    w.fbq = (...args) => events.push(args);
    trackPurchase('NJ-2026-001', purchase);
    trackPurchase('NJ-2026-001', purchase);
    assert.equal(events.length, 2);
    const payload = events[0][2] as { value: number; items: { quantity: number }[]; page_location: string };
    assert.equal(payload.value, 360);
    assert.equal(payload.items[0].quantity, 2);
    assert.equal(payload.page_location, 'https://example.invalid/odeme/sonuc');
    storage.set(COOKIE_CONSENT_KEY, 'rejected');
    trackPurchase('NJ-2026-002', purchase);
    assert.equal(events.length, 2);
  } finally { Reflect.deleteProperty(globalThis, 'window'); }
});
