import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { buildOrder } from '../src/lib/checkout/buildOrder';
import { createLegalAcceptance } from '../src/lib/create-legal-acceptance';
import { legalAcceptanceText } from '../src/lib/legal-acceptance';
import { purchaseEvent } from '../src/lib/purchase-event';
import { reconcileCart } from '../src/lib/cart-catalog';
import { kargoTamamlayicilar } from '../src/lib/recommendations';
import { searchCatalogProducts } from '../src/lib/catalog-search';
import { SHIPPING } from '../src/lib/config';
import type { Product } from '../src/types/product';

const product: Product = {
  id: 'dynamic-1', slug: 'celeste-test', name: 'Celeste Test', description: 'Test ürünü', story: '',
  category: 'kupe', collection: 'barcelona', price: 180, material: 'celik', defaultVariant: 'gold',
  features: [], createdAt: new Date(), updatedAt: new Date(),
  variants: [{ id: 'gold', stock: 3, color: 'altin', material: 'celik', images: ['/media/test.webp'] }],
};
const customer = { name: 'Test', surname: 'Alıcı', email: 'test@example.invalid', phone: '05000000000', address: 'Test adresi 123', city: 'İstanbul', district: 'Kadıköy' };
const line = { productId: product.id, variantId: 'gold', quantity: 2 };
const resolve = async (id: string) => id === product.id ? product : undefined;

test('server ignores supplied prices, keeps quantity and customization, computes shipping', async () => {
  const result = await buildOrder([{ ...line, price: 0.01, customization: 'Ada' }], customer, 'test', resolve);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.order.subtotal, 360);
  assert.equal(result.order.total, 360 + (360 < SHIPPING.freeThreshold ? SHIPPING.fee : 0));
  assert.equal(result.order.items[0].image, '/media/test.webp');
  assert.equal(result.order.items[0].customization, 'Ada');
});

test('duplicate/customized rows cannot bypass combined variant stock', async () => {
  assert.equal((await buildOrder([{ ...line, customization: 'A' }, { ...line, customization: 'B' }], customer, 'test', resolve)).ok, false);
  for (const input of [[{ ...line, productId: 'unpublished' }], [{ ...line, variantId: 'missing' }], [{ ...line, quantity: -1 }]]) {
    assert.equal((await buildOrder(input, customer, 'test', resolve)).ok, false);
  }
});

test('legal snapshot preserves all three documents and original checkout details', async () => {
  const built = await buildOrder([line], customer, 'NJ-2026-0001', resolve);
  assert.ok(built.ok);
  const saved = createLegalAcceptance(built.order);
  assert.equal(saved.documents.length, 3);
  assert.equal(saved.contractAccepted, true);
  assert.ok(saved.documents.every((d) => d.text.length > 1000));
  const original = saved.purchase.items[0].price;
  built.order.items[0].price = 1;
  assert.equal(saved.purchase.items[0].price, original);
  const text = legalAcceptanceText(built.order.id, saved);
  for (const word of ['Satıcı', '14 gün', 'KVKK', 'Metehan Arslan', '360.00', 'Alıcı']) assert.ok(text.includes(word), word);
  assert.ok(!text.includes('iade kargo ücreti alıcıya'));
});

test('purchase event carries paid items and quantities, shipping excluded from item value', () => {
  const event = purchaseEvent('NJ-2026-0012', { total: 409.9, items: [{ productId: product.id, variantId: 'gold', ad: product.name, adet: 2, birimFiyat: 180 }] });
  assert.equal(event.transaction_id, 'NJ-2026-0012');
  assert.equal(event.value, 360);
  assert.equal(event.shipping, 49.9);
  assert.equal(event.items[0].quantity, 2);
  assert.equal(event.items[0].item_id, product.id);
});

test('persisted cart drops unavailable IDs and shares stock across customizations', () => {
  const stale = { ...product, price: 1, slug: 'old-link' };
  const cart = [
    { id: 'one', product: stale, variant: stale.variants[0], quantity: 2 },
    { id: 'two', product: stale, variant: stale.variants[0], quantity: 2, customization: 'B' },
    { id: 'missing', product: { ...stale, id: 'gone' }, variant: stale.variants[0], quantity: 1 },
  ];
  const updated = reconcileCart(cart, [product]);
  assert.equal(updated.length, 2);
  assert.deepEqual(updated.map((i) => i.quantity), [2, 1]);
  assert.equal(updated[0].product.price, 180);
  assert.equal(updated[0].product.slug, 'celeste-test');
  assert.deepEqual(reconcileCart(cart, []), []);
});

test('shipping suggestions use only provided live catalog and exclude sold-out variants', () => {
  const soldOut = { ...product, id: 'sold', variants: [{ ...product.variants[0], stock: 0 }] };
  const result = kargoTamamlayicilar([product, soldOut], 300, []);
  assert.deepEqual(result.map((p) => p.id), [product.id]);
  assert.deepEqual(kargoTamamlayicilar([product], 300, [product.id]), []);
});

test('search matches new catalog entries and Turkish spelling variants', () => {
  const p = { ...product, name: 'Altın Küpe' };
  for (const query of ['ALTIN', 'altın', 'kupe', 'KÜPE']) assert.equal(searchCatalogProducts([p], query)[0].id, p.id);
  assert.deepEqual(searchCatalogProducts([], 'Celeste'), []);
  assert.deepEqual(searchCatalogProducts([p], '   '), []);
});

test('additive migration keeps old orders and persists new immutable acceptance in Postgres', async () => {
  const pg = new PGlite();
  try {
    await pg.exec("CREATE TABLE orders (id text PRIMARY KEY); INSERT INTO orders VALUES ('old');");
    await pg.exec(readFileSync('drizzle/0015_order_legal_acceptance.sql', 'utf8'));
    assert.equal((await pg.query<{ legal_acceptance: unknown }>('SELECT legal_acceptance FROM orders')).rows[0].legal_acceptance, null);
    const built = await buildOrder([line], customer, 'new', resolve);
    assert.ok(built.ok);
    const snapshot = createLegalAcceptance(built.order);
    await pg.query('INSERT INTO orders (id, legal_acceptance) VALUES ($1,$2)', ['new', JSON.stringify(snapshot)]);
    const saved = (await pg.query<{ legal_acceptance: typeof snapshot }>("SELECT legal_acceptance FROM orders WHERE id='new'")).rows[0].legal_acceptance;
    assert.deepEqual(saved, JSON.parse(JSON.stringify(snapshot)));
    await assert.rejects(pg.transaction(async (tx) => {
      await tx.query("INSERT INTO orders (id) VALUES ('rollback')");
      throw new Error('expected rollback');
    }));
    assert.equal((await pg.query("SELECT id FROM orders WHERE id='rollback'")).rows.length, 0);
  } finally { await pg.close(); }
});
