import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import type { db as appDb } from '../src/db';
import { catalogProducts } from '../src/db/schema';
import {
  CatalogUnavailableError,
  getCatalogProductById,
  getCatalogProductBySlug,
  getCatalogProducts,
} from '../src/lib/catalog';
import { buildOrder } from '../src/lib/checkout/buildOrder';
import { PRODUCTS } from '../src/data/products';

type Database = typeof appDb;

function stored(id: string, overrides: Record<string, unknown> = {}) {
  return {
    id, slug: `${id}-slug`, name: `Ürün ${id}`, description: 'Test', story: '', category: 'yuzuk' as const,
    collection: 'paris' as const, price: 100, material: 'altin-kaplama' as const, defaultVariant: 'v1', features: [],
    variants: [{ id: 'v1', color: 'altin' as const, material: 'altin-kaplama' as const, stock: 3, images: ['/x.jpg'] }],
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-02T00:00:00.000Z', ...overrides,
  };
}

async function setup() {
  const pg = new PGlite();
  await pg.exec(`CREATE TABLE catalog_products (id text PRIMARY KEY, slug text UNIQUE NOT NULL, data jsonb NOT NULL,
    published boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now())`);
  const database = drizzle(pg) as unknown as Database;
  return { pg, database };
}

const customer = { name: 'Test', surname: 'Alıcı', email: 'test@example.invalid', phone: '05000000000', address: 'Test adresi 123', city: 'İstanbul', district: 'Kadıköy' };

test('DB unavailable (no connection) → CatalogUnavailableError, never the static catalog', async () => {
  const none = null as unknown as Database;
  await assert.rejects(getCatalogProducts(undefined, none), CatalogUnavailableError);
  await assert.rejects(getCatalogProductBySlug(PRODUCTS[0].slug, none), CatalogUnavailableError);
  await assert.rejects(getCatalogProductById(PRODUCTS[0].id, none), CatalogUnavailableError);
});

test('default connection is absent in tests (DATABASE_URL empty) and reads fail closed', async () => {
  await assert.rejects(getCatalogProducts(), CatalogUnavailableError);
  await assert.rejects(getCatalogProductById(PRODUCTS[0].id), CatalogUnavailableError);
});

test('a failing query is an outage, not a missing product', async () => {
  const broken = { select() { throw new Error('connection reset'); } } as unknown as Database;
  await assert.rejects(getCatalogProducts(undefined, broken), (error: unknown) => error instanceof CatalogUnavailableError && (error.cause as Error).message === 'connection reset');
  await assert.rejects(getCatalogProductBySlug('any', broken), CatalogUnavailableError);
  await assert.rejects(getCatalogProductById('any', broken), CatalogUnavailableError);
});

test('DB available + empty catalog → [] and undefined; legacy PRODUCTS are not resurrected', async () => {
  const { pg, database } = await setup();
  try {
    assert.deepEqual(await getCatalogProducts(undefined, database), []);
    assert.equal(await getCatalogProductBySlug(PRODUCTS[0].slug, database), undefined);
    assert.equal(await getCatalogProductById(PRODUCTS[0].id, database), undefined);
  } finally { await pg.close(); }
});

test('DB populated → only DB products; hidden, unpublished and trashed stay out of listings', async () => {
  const { pg, database } = await setup();
  try {
    await database.insert(catalogProducts).values([
      { id: 'live', slug: 'live-slug', data: stored('live'), published: true },
      { id: 'hidden', slug: 'hidden-slug', data: stored('hidden', { hidden: true }), published: true },
      { id: 'draft', slug: 'draft-slug', data: stored('draft'), published: false },
      { id: 'trash', slug: 'trash-slug', data: stored('trash', { deletedAt: '2026-02-01T00:00:00.000Z' }), published: true },
    ]);
    const listed = await getCatalogProducts(undefined, database);
    assert.deepEqual(listed.map((p) => p.id), ['live']);
    assert.ok(listed[0].createdAt instanceof Date);
    assert.deepEqual((await getCatalogProducts({ includeHidden: true }, database)).map((p) => p.id).sort(), ['hidden', 'live']);
    assert.equal((await getCatalogProductBySlug('live-slug', database))?.id, 'live');
    assert.equal((await getCatalogProductById('hidden', database))?.id, 'hidden');
    assert.equal(await getCatalogProductById('draft', database), undefined);
    assert.equal(await getCatalogProductBySlug('trash-slug', database), undefined);
  } finally { await pg.close(); }
});

test('DB populated + unknown product → undefined (404 path), even for an id that exists only in legacy PRODUCTS', async () => {
  const { pg, database } = await setup();
  try {
    await database.insert(catalogProducts).values({ id: 'live', slug: 'live-slug', data: stored('live'), published: true });
    assert.equal(await getCatalogProductBySlug('does-not-exist', database), undefined);
    assert.equal(await getCatalogProductById('does-not-exist', database), undefined);
    assert.equal(await getCatalogProductById(PRODUCTS[0].id, database), undefined);
    assert.equal(await getCatalogProductBySlug(PRODUCTS[0].slug, database), undefined);
  } finally { await pg.close(); }
});

test('checkout pricing resolves products from the catalog only: outage rejects, legacy id is not orderable', async () => {
  await assert.rejects(buildOrder([{ productId: PRODUCTS[0].id, variantId: PRODUCTS[0].variants[0].id, quantity: 1 }], customer, ''), CatalogUnavailableError);
  const { pg, database } = await setup();
  try {
    const resolve = (id: string) => getCatalogProductById(id, database);
    const result = await buildOrder([{ productId: PRODUCTS[0].id, variantId: PRODUCTS[0].variants[0].id, quantity: 1 }], customer, '', resolve);
    assert.deepEqual(result, { ok: false, error: 'Ürün bulunamadı.' });
  } finally { await pg.close(); }
});

test('catalog and order modules no longer depend on the legacy static catalog', () => {
  for (const file of ['src/lib/catalog.ts', 'src/lib/orders.ts', 'src/lib/checkout/buildOrder.ts']) {
    assert.doesNotMatch(readFileSync(file, 'utf8'), /from ['"]@\/data\/products['"]/, file);
  }
});
