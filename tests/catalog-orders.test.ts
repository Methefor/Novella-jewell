import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { eq } from 'drizzle-orm';
import type { db as appDb } from '../src/db';
import { catalogProducts, inventory, orderEvents, orders, stockMovements } from '../src/db/schema';
import { CatalogProductMissingError, createPendingOrder, markOrderPaid } from '../src/lib/orders';
import { StockUnavailableError } from '../src/lib/checkout/stock-reservation';
import { createLegalAcceptance } from '../src/lib/create-legal-acceptance';
import type { Order } from '../src/lib/checkout/types';
import { PRODUCTS } from '../src/data/products';

type Database = typeof appDb;

// Gerçek migration'lar uygulanır: sipariş numarası, stok ve katalog tabloları üretimle aynı şemadadır.
async function setup() {
  const pg = new PGlite();
  for (const file of readdirSync('drizzle').filter((name) => name.endsWith('.sql')).sort()) {
    await pg.exec(readFileSync(`drizzle/${file}`, 'utf8'));
  }
  return { pg, database: drizzle(pg) as unknown as Database };
}

function stored(id: string, stock: number, overrides: Record<string, unknown> = {}) {
  return {
    id, slug: `${id}-slug`, name: `Ürün ${id}`, description: 'Test', story: '', category: 'yuzuk' as const,
    collection: 'paris' as const, price: 100, material: 'altin-kaplama' as const, defaultVariant: 'v1', features: [],
    variants: [{ id: 'v1', color: 'altin' as const, material: 'altin-kaplama' as const, stock, images: ['/x.jpg'] }],
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-02T00:00:00.000Z', ...overrides,
  };
}

function orderFor(productId: string, quantity = 1): Order {
  return {
    id: '', currency: 'TRY', createdAt: new Date().toISOString(), subtotal: 100 * quantity, shippingCost: 0, total: 100 * quantity,
    customer: { name: 'Test', surname: 'Alıcı', email: 'test@example.invalid', phone: '05000000000', address: 'Test adresi 123', city: 'İstanbul', district: 'Kadıköy' },
    items: [{ productId, variantId: 'v1', slug: `${productId}-slug`, name: `Ürün ${productId}`, price: 100, quantity }],
  };
}
const legalFor = (order: Order) => createLegalAcceptance(order);

async function counts(database: Database) {
  return {
    orders: (await database.select().from(orders)).length,
    inventory: (await database.select().from(inventory)).length,
    catalog: (await database.select().from(catalogProducts)).length,
  };
}

test('order for a product that is missing from the DB catalog is not created (fail closed)', async () => {
  const { pg, database } = await setup();
  try {
    await assert.rejects(createPendingOrder(orderFor('ghost'), 'rnd', legalFor(orderFor('ghost')), database), CatalogProductMissingError);
    assert.deepEqual(await counts(database), { orders: 0, inventory: 0, catalog: 0 });
  } finally { await pg.close(); }
});

test('a product that exists only in legacy PRODUCTS is never orderable nor seeded into the DB', async () => {
  const { pg, database } = await setup();
  try {
    const legacy = PRODUCTS[0];
    await database.insert(catalogProducts).values({ id: 'live', slug: 'live-slug', data: stored('live', 5), published: true });
    await assert.rejects(createPendingOrder(orderFor(legacy.id), 'rnd', legalFor(orderFor(legacy.id)), database), CatalogProductMissingError);
    assert.deepEqual(await counts(database), { orders: 0, inventory: 0, catalog: 1 });
  } finally { await pg.close(); }
});

test('unpublished, trashed or variant-less catalog rows are refused as well', async () => {
  const { pg, database } = await setup();
  try {
    await database.insert(catalogProducts).values([
      { id: 'draft', slug: 'draft-slug', data: stored('draft', 5), published: false },
      { id: 'trash', slug: 'trash-slug', data: stored('trash', 5, { deletedAt: '2026-02-01T00:00:00.000Z' }), published: true },
      { id: 'live', slug: 'live-slug', data: stored('live', 5), published: true },
    ]);
    await assert.rejects(createPendingOrder(orderFor('draft'), 'rnd', legalFor(orderFor('draft')), database), CatalogProductMissingError);
    await assert.rejects(createPendingOrder(orderFor('trash'), 'rnd', legalFor(orderFor('trash')), database), CatalogProductMissingError);
    const wrongVariant = orderFor('live');
    wrongVariant.items[0].variantId = 'missing-variant';
    await assert.rejects(createPendingOrder(wrongVariant, 'rnd', legalFor(wrongVariant), database), CatalogProductMissingError);
    assert.equal((await counts(database)).orders, 0);
  } finally { await pg.close(); }
});

test('DB product → normal order; inventory seeded from the DB catalog row; stock only reserved until payment', async () => {
  const { pg, database } = await setup();
  try {
    await database.insert(catalogProducts).values({ id: 'live', slug: 'live-slug', data: stored('live', 2), published: true });
    const created = await createPendingOrder(orderFor('live'), 'rnd', legalFor(orderFor('live')), database);
    assert.ok(created);
    assert.match(created.orderNo, /^NJ-\d{4}-\d{4}$/);
    const [order] = await database.select().from(orders).where(eq(orders.orderNo, created.orderNo));
    assert.equal(order.status, 'pending');
    assert.equal(order.total, '100.00');
    assert.equal((await database.select().from(inventory))[0].stock, 2, 'reservation does not decrement stock');
    assert.equal((await database.select().from(stockMovements)).length, 0);
  } finally { await pg.close(); }
});

test('reservation still refuses to oversell a DB product', async () => {
  const { pg, database } = await setup();
  try {
    await database.insert(catalogProducts).values({ id: 'live', slug: 'live-slug', data: stored('live', 1), published: true });
    assert.ok(await createPendingOrder(orderFor('live'), 'rnd-1', legalFor(orderFor('live')), database));
    await assert.rejects(createPendingOrder(orderFor('live'), 'rnd-2', legalFor(orderFor('live')), database), StockUnavailableError);
    assert.equal((await counts(database)).orders, 1);
  } finally { await pg.close(); }
});

test('payment completion decrements stock atomically once and mirrors it into the DB catalog', async () => {
  const { pg, database } = await setup();
  try {
    await database.insert(catalogProducts).values({ id: 'live', slug: 'live-slug', data: stored('live', 3), published: true });
    const created = await createPendingOrder(orderFor('live', 2), 'rnd', legalFor(orderFor('live', 2)), database);
    assert.ok(created);
    const results = await Promise.all([1, 2].map(() => markOrderPaid(created.orderNo, undefined, database, () => {})));
    assert.ok(results.every((result) => result.ok));
    assert.equal(results.filter((result) => result.ok && !result.zatenPaid).length, 1);
    assert.equal((await database.select().from(inventory))[0].stock, 1);
    assert.equal((await database.select().from(stockMovements)).length, 1);
    const [row] = await database.select().from(catalogProducts);
    assert.equal(row.data.variants[0].stock, 1);
    assert.equal((await database.select().from(orderEvents)).length, 0, 'a mirrored product raises no anomaly event');
  } finally { await pg.close(); }
});

test('payment completion never creates a catalog row from the legacy static catalog, and records the anomaly once', async () => {
  const { pg, database } = await setup();
  const logged = mock.method(console, 'error', () => {});
  try {
    const legacy = PRODUCTS[0];
    const variant = legacy.variants[0];
    // Ödeme zaten alınmış eski bir sipariş: kalem yalnızca envanterde var, DB kataloğunda yok.
    await database.insert(inventory).values({ productId: legacy.id, variantId: variant.id, stock: 4 });
    const [order] = await database.insert(orders).values({
      status: 'pending', total: '100.00', randomNr: 'rnd', checkoutReserved: true,
      customer: { adSoyad: 'Test', email: 'customer@example.invalid', telefon: '', adres: '', il: '' },
      items: [{ productId: legacy.id, variantId: variant.id, slug: legacy.slug, ad: legacy.name, adet: 1, birimFiyat: 100 }],
    }).returning();

    const result = await markOrderPaid(order.orderNo, undefined, database, () => {});
    assert.ok(result.ok && !result.zatenPaid, 'payment still succeeds');
    assert.equal((await database.select().from(orders).where(eq(orders.id, order.id)))[0].status, 'paid');
    assert.equal((await database.select().from(inventory))[0].stock, 3, 'the paid order still decrements its stock ledger once');
    assert.equal((await database.select().from(stockMovements)).length, 1);
    assert.equal((await database.select().from(catalogProducts)).length, 0, 'no catalog row is seeded from PRODUCTS');

    const events = await database.select().from(orderEvents);
    assert.equal(events.length, 1);
    assert.equal(events[0].orderId, order.id);
    assert.equal(events[0].eventType, 'catalog_mirror_missing');
    assert.equal(events[0].toValue, `${legacy.id}/${variant.id}`);
    assert.equal(events[0].createdBy, 'system:payment-callback');
    assert.match(events[0].note, /katalog kaydı bulunamadı/);

    assert.equal(logged.mock.callCount(), 1, 'one diagnostic log after commit');
    assert.deepEqual(logged.mock.calls[0].arguments, ['[orders] Paid order line has no catalog record', { orderNo: order.orderNo, productId: legacy.id, variantId: variant.id }]);

    // Aynı callback tekrar gelirse: no-op, ikinci olay/log/stok düşümü yok.
    const repeat = await markOrderPaid(order.orderNo, undefined, database, () => {});
    assert.ok(repeat.ok && repeat.zatenPaid);
    assert.equal((await database.select().from(orderEvents)).length, 1, 'no duplicate anomaly event');
    assert.equal((await database.select().from(inventory))[0].stock, 3);
    assert.equal(logged.mock.callCount(), 1);
  } finally { logged.mock.restore(); await pg.close(); }
});
