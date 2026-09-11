import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PGlite, type Transaction } from '@electric-sql/pglite';
import { sql } from 'drizzle-orm';
import { PgDialect } from 'drizzle-orm/pg-core';
import { lockOrderPayments, reserveOrderStock, releasePaymentToCustomer, StockUnavailableError, type StockTransaction } from '../src/lib/checkout/stock-reservation';
import type { OrderItem } from '../src/lib/checkout/types';

const item: OrderItem = { productId: 'last-product', variantId: 'gold', slug: 'last-product', name: 'Son ürün', quantity: 1, price: 100 };
const dialect = new PgDialect();
function adapter(pg: Transaction): StockTransaction {
  return { async execute(query) {
    const { sql: text, params } = dialect.sqlToQuery(query);
    return pg.query<Record<string, unknown>>(text, params);
  } };
}
async function setup() {
  const pg = new PGlite();
  await pg.exec(`
    CREATE TABLE orders (
      id serial PRIMARY KEY, order_no text UNIQUE, status text NOT NULL DEFAULT 'pending',
      items jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE inventory (product_id text, variant_id text, stock integer NOT NULL, PRIMARY KEY(product_id,variant_id));
    INSERT INTO inventory VALUES ('last-product','gold',1);
  `);
  await pg.exec(readFileSync('drizzle/0016_checkout_stock_reservation.sql', 'utf8'));
  return pg;
}
async function pending(tx: StockTransaction, orderNo: string, options: { issued?: boolean; old?: boolean; legacy?: boolean } = {}) {
  const rows = JSON.stringify([{ productId: item.productId, variantId: item.variantId, adet: 1 }]);
  await tx.execute(sql`INSERT INTO orders (order_no, items, checkout_reserved, payment_ready_at, created_at)
    VALUES (${orderNo}, ${rows}::jsonb, ${!options.legacy},
      ${options.issued ? new Date().toISOString() : null}::timestamptz,
      ${new Date(Date.now() - (options.old ? 3600_000 : 0)).toISOString()}::timestamptz)`);
}

test('competing checkout transactions cannot both reserve the last unit', async () => {
  const pg = await setup();
  try {
    const results = await Promise.allSettled(['first', 'second'].map((id) => pg.transaction(async (raw) => {
      const tx = adapter(raw);
      await reserveOrderStock(tx, [item]);
      await pending(tx, id);
    })));
    assert.equal(results.filter((r) => r.status === 'fulfilled').length, 1);
    const rejected = results.find((r) => r.status === 'rejected') as PromiseRejectedResult;
    assert.ok(rejected.reason instanceof StockUnavailableError);
    assert.equal((await pg.query('SELECT * FROM orders')).rows.length, 1);
    assert.equal((await pg.query<{ stock: number }>('SELECT stock FROM inventory')).rows[0].stock, 1);
  } finally { await pg.close(); }
});

test('failed payment releases its hold; duplicate customized lines share the same stock', async () => {
  const pg = await setup();
  try {
    await pg.transaction(async (raw) => { const tx = adapter(raw); await reserveOrderStock(tx, [item]); await pending(tx, 'failed'); });
    await pg.transaction(async (raw) => { const tx = adapter(raw); await lockOrderPayments(tx); await tx.execute(sql`UPDATE orders SET status='failed' WHERE order_no='failed'`); });
    await assert.rejects(pg.transaction((raw) => reserveOrderStock(adapter(raw), [item, { ...item, customization: 'A' }])), StockUnavailableError);
    await pg.transaction(async (raw) => { const tx = adapter(raw); await reserveOrderStock(tx, [item]); await pending(tx, 'retry'); });
  } finally { await pg.close(); }
});

test('unissued checkout can expire but an issued or legacy payment retains stock until provider outcome', async () => {
  const pg = await setup();
  try {
    await pg.transaction(async (raw) => {
      const tx = adapter(raw);
      await pending(tx, 'unissued', { old: true });
      assert.equal(await releasePaymentToCustomer(tx, 'unissued'), false);
      await reserveOrderStock(tx, [item]);
      await pending(tx, 'issued', { issued: true, old: true });
    });
    assert.equal((await pg.query<{ status: string }>("SELECT status FROM orders WHERE order_no='unissued'")).rows[0].status, 'failed');
    await assert.rejects(pg.transaction((raw) => reserveOrderStock(adapter(raw), [item])), StockUnavailableError);
    await pg.exec("UPDATE orders SET status='failed' WHERE order_no='issued'");
    await pg.transaction((raw) => pending(adapter(raw), 'legacy', { legacy: true, old: true }));
    await assert.rejects(pg.transaction((raw) => reserveOrderStock(adapter(raw), [item])), StockUnavailableError);
    assert.equal((await pg.query<{ status: string }>("SELECT status FROM orders WHERE order_no='legacy'")).rows[0].status, 'pending');
  } finally { await pg.close(); }
});

test('iframe readiness is persisted once and paid stock is not made available again', async () => {
  const pg = await setup();
  try {
    await pg.transaction(async (raw) => { const tx = adapter(raw); await reserveOrderStock(tx, [item]); await pending(tx, 'paid'); });
    assert.equal(await pg.transaction((raw) => releasePaymentToCustomer(adapter(raw), 'paid')), true);
    assert.equal(await pg.transaction((raw) => releasePaymentToCustomer(adapter(raw), 'paid')), false);
    await pg.transaction(async (raw) => {
      const tx = adapter(raw); await lockOrderPayments(tx);
      await tx.execute(sql`UPDATE inventory SET stock=stock-1 WHERE product_id=${item.productId} AND variant_id=${item.variantId}`);
      await tx.execute(sql`UPDATE orders SET status='paid' WHERE order_no='paid'`);
    });
    await assert.rejects(pg.transaction((raw) => reserveOrderStock(adapter(raw), [item])), StockUnavailableError);
  } finally { await pg.close(); }
});
