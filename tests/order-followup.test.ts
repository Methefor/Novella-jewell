import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { eq } from 'drizzle-orm';
import type { db as appDb } from '../src/db';
import { orders, emailOutbox } from '../src/db/schema';
import { claimEmail, deliverEmail, enqueueEmail } from '../src/lib/email-outbox';
import { parsePayTRStatus } from '../src/lib/checkout/paytr-status';
import { completeRefund, matchingCompletedRefund } from '../src/lib/order-followup';
import { markOrderPaid } from '../src/lib/orders';

const message = { from: 'test@example.com', to: 'customer@example.com', subject: 'Sipariş', html: '<p>Merhaba</p>' };
const fixture = `
  CREATE TABLE orders (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_no text UNIQUE NOT NULL,
    status text NOT NULL DEFAULT 'pending', fulfillment_status text NOT NULL DEFAULT 'new', carrier text, tracking_number text,
    operation_note text NOT NULL DEFAULT '', items jsonb NOT NULL DEFAULT '[]', total numeric(10,2) NOT NULL DEFAULT 100,
    customer jsonb NOT NULL DEFAULT '{"adSoyad":"Test","email":"customer@example.com"}', legal_acceptance jsonb,
    checkout_reserved boolean NOT NULL DEFAULT true, payment_ready_at timestamptz, shopier_payment_id text, random_nr text NOT NULL DEFAULT 'fixture',
    created_at timestamptz NOT NULL DEFAULT now(), paid_at timestamptz, updated_at timestamptz NOT NULL DEFAULT now(), cancelled_at timestamptz,
    refunded_at timestamptz, refund_amount numeric(10,2), refund_status text, refund_reference text);
  CREATE TABLE order_events (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_id uuid NOT NULL REFERENCES orders(id), event_type text NOT NULL,
    from_value text, to_value text, note text NOT NULL DEFAULT '', created_by text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
  CREATE TABLE inventory (product_id text, variant_id text, stock integer, low_stock_threshold integer DEFAULT 3, updated_at timestamptz, PRIMARY KEY(product_id,variant_id));
  CREATE TABLE stock_movements (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), product_id text,variant_id text,delta integer,previous_stock integer,new_stock integer,source text,reason text,reference text,created_by text,created_at timestamptz DEFAULT now());
  CREATE TABLE catalog_products (id text PRIMARY KEY,slug text,data jsonb,published boolean,created_at timestamptz,updated_at timestamptz);
`;

async function setup() {
  const pg = new PGlite();
  await pg.exec(fixture);
  await pg.query("INSERT INTO orders (order_no,status,refund_status) VALUES ('NJ-2026-0009','paid','success')");
  const migration = readFileSync('drizzle/0017_order_followup.sql', 'utf8');
  await pg.exec(migration);
  await pg.exec(migration); // Safe reapplication; legacy payment is never backfilled.
  assert.equal((await pg.query('SELECT * FROM email_outbox')).rows.length, 0);
  const database = drizzle(pg) as unknown as typeof appDb;
  const [order] = await database.insert(orders).values({ orderNo: 'NJ-2026-0010', randomNr: 'test', total: '100.00', customer: { adSoyad: 'Test', email: 'customer@example.com', telefon: '', adres: '', il: '' }, items: [] }).returning();
  return { pg, database, order };
}

test('payment retries consume stock once and atomically queue one immutable confirmation', async () => {
  const { pg, database, order } = await setup();
  try {
    await pg.query("INSERT INTO inventory (product_id,variant_id,stock) VALUES ('fixture-product','v1',1)");
    await database.update(orders).set({ items: [{ productId: 'fixture-product', variantId: 'v1', slug: 'fixture', ad: 'Ürün', adet: 1, birimFiyat: 100 }] }).where(eq(orders.id, order.id));
    const results = await Promise.all([1, 2].map(() => markOrderPaid(order.orderNo, undefined, database, () => {})));
    assert.ok(results.every((result) => result.ok));
    assert.equal((await pg.query<{ stock: number }>('SELECT stock FROM inventory')).rows[0].stock, 0);
    assert.equal((await pg.query('SELECT * FROM stock_movements')).rows.length, 1);
    const emails = await database.select().from(emailOutbox);
    assert.equal(emails.length, 1);
    assert.equal(emails[0].payload.to, order.customer.email);
    assert.equal(emails[0].kind, 'order_confirmation');
  } finally { await pg.close(); }
});

test('email persistence failure rolls back the payment and stock change', async () => {
  const { pg, database, order } = await setup();
  try {
    await pg.exec("CREATE FUNCTION reject_email() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'fixture'; END $$; CREATE TRIGGER reject_email BEFORE INSERT ON email_outbox FOR EACH ROW EXECUTE FUNCTION reject_email()");
    await assert.rejects(markOrderPaid(order.orderNo, undefined, database, () => {}));
    assert.equal((await database.select().from(orders).where(eq(orders.id, order.id)))[0].status, 'pending');
  } finally { await pg.close(); }
});

test('concurrent workers claim once; ambiguous retry uses identical key and frozen content; expired retries need review', async () => {
  const { pg, database, order } = await setup();
  try {
    await enqueueEmail(database, order.id, 'fixture', 'fixture/1', message);
    await enqueueEmail(database, order.id, 'fixture', 'fixture/1', { ...message, subject: 'Changed' });
    const claims = await Promise.all([claimEmail(database), claimEmail(database)]);
    const claimed = claims.filter((entry) => entry !== null);
    assert.equal(claimed.length, 1);
    const keys: string[] = [];
    await deliverEmail(claimed[0], database, async (payload, key) => { assert.deepEqual(payload, message); keys.push(key); throw new Error('ambiguous transport'); });
    await database.update(emailOutbox).set({ nextAttemptAt: new Date(0) });
    const retry = (await claimEmail(database))!;
    await deliverEmail(retry, database, async (payload, key) => { assert.deepEqual(payload, message); keys.push(key); return 'resend-fixture'; });
    assert.equal(keys[0], keys[1]);
    assert.equal(await claimEmail(database), null);
    await enqueueEmail(database, order.id, 'fixture', 'fixture/2', message);
    const abandoned = (await claimEmail(database))!;
    await database.update(emailOutbox).set({ firstAttemptAt: new Date(Date.now() - 25 * 3600_000), lockedUntil: new Date(0) }).where(eq(emailOutbox.id, abandoned.id));
    assert.equal(await claimEmail(database), null);
    assert.equal((await database.select().from(emailOutbox).where(eq(emailOutbox.id, abandoned.id)))[0].status, 'review');
  } finally { await pg.close(); }
});

test('PayTR 004 stays uncertain; amount/currency/test mismatches cannot mark payment paid', () => {
  assert.deepEqual(parsePayTRStatus({ status: 'error', err_no: '004' }, '100.00', false), { state: 'unknown' });
  const paid = { status: 'success', payment_amount: '100,00', currency: 'TL', test_mode: '0', returns: [] };
  assert.equal(parsePayTRStatus(paid, '100.00', false).state, 'paid');
  for (const override of [{ payment_amount: '10000' }, { currency: 'USD' }, { test_mode: '1' }, { payment_amount: null }]) assert.throws(() => parsePayTRStatus({ ...paid, ...override }, '100.00', false));
});

test('refund completion requires matching reference, amount and completed date; repeated checks create one email', async () => {
  const { pg, database, order } = await setup();
  try {
    const response = (entry: Record<string, unknown>) => parsePayTRStatus({ status: 'success', payment_amount: '100.00', currency: 'TRY', test_mode: '0', returns: [entry] }, '100.00', false);
    const entry = { return_amount: '100.00', reference_no: 'REF10', date_completed: '2026-09-03 18:02:17' };
    assert.ok(matchingCompletedRefund(response(entry), 'REF10', '100.00'));
    for (const override of [{ reference_no: 'OTHER' }, { return_amount: '50.00' }, { date_completed: '' }, { date_completed: '0000-00-00 00:00:00' }]) assert.equal(matchingCompletedRefund(response({ ...entry, ...override }), 'REF10', '100.00'), false);
    await database.update(orders).set({ status: 'paid', fulfillmentStatus: 'returned', refundStatus: 'submitted', refundReference: 'REF10', refundAmount: '100.00' }).where(eq(orders.id, order.id));
    assert.deepEqual((await Promise.all([completeRefund(order.id, database), completeRefund(order.id, database)])).sort(), [false, true]);
    const emails = await database.select().from(emailOutbox);
    assert.equal(emails.length, 1);
    assert.equal(emails[0].kind, 'refund_completed');
    assert.ok(emails[0].payload.html.includes('bankanıza bağlıdır'));
    assert.equal((await pg.query('SELECT * FROM stock_movements')).rows.length, 0);
    assert.equal(await completeRefund(randomUUID(), database), false);
  } finally { await pg.close(); }
});
