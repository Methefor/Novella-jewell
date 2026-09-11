import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { orders } from '../src/db/schema';
import { refundClaimCondition, refundFailureStatus } from '../src/lib/refund-safety';
import { PayTRRefundRejectedError, refundPayTRPayment } from '../src/lib/checkout/paytr';

test('refund claim cannot touch another failed order or reclaim a processing/review/success payment', async () => {
  const pg = new PGlite();
  try {
    await pg.exec('CREATE TABLE orders (id uuid PRIMARY KEY, refund_status text)');
    const db = drizzle(pg);
    const ids = Array.from({ length: 5 }, () => crypto.randomUUID());
    for (const [i, status] of [null, 'failed', 'processing', 'review', 'success'].entries()) {
      await pg.query('INSERT INTO orders VALUES ($1,$2)', [ids[i], status]);
    }
    const claimed = await db.update(orders).set({ refundStatus: 'processing' }).where(refundClaimCondition(ids[0])).returning({ id: orders.id });
    assert.deepEqual(claimed.map((r) => r.id), [ids[0]]);
    assert.equal((await pg.query<{ refund_status: string }>('SELECT refund_status FROM orders WHERE id=$1', [ids[1]])).rows[0].refund_status, 'failed');
    for (const id of [ids[0], ...ids.slice(2)]) {
      assert.equal((await db.update(orders).set({ refundStatus: 'processing' }).where(refundClaimCondition(id)).returning({ id: orders.id })).length, 0);
    }
  } finally { await pg.close(); }
});

test('refund request is signed, explicit rejection is retryable, uncertain outcomes require review', async (t) => {
  // Mock replaces the complete transport: no request leaves this test process.
  process.env.PAYTR_MERCHANT_ID = 'test-merchant';
  process.env.PAYTR_MERCHANT_KEY = 'test-key';
  process.env.PAYTR_MERCHANT_SALT = 'test-salt';
  let outcome: 'success' | 'rejected' | 'timeout' | 'invalid' = 'success';
  const mock = t.mock.method(globalThis, 'fetch', async (url: unknown, init?: RequestInit) => {
    assert.equal(url, 'https://www.paytr.com/odeme/iade');
    const body = init?.body as URLSearchParams;
    assert.equal(body.get('merchant_oid'), 'NJ20260001');
    assert.equal(body.get('return_amount'), '49.00');
    assert.equal(body.get('reference_no'), 'TESTREF');
    assert.equal(body.get('paytr_token'), crypto.createHmac('sha256', 'test-key').update('test-merchantNJ2026000149.00test-salt').digest('base64'));
    if (outcome === 'timeout') throw new DOMException('Timed out', 'TimeoutError');
    if (outcome === 'invalid') return new Response('<html>unavailable</html>', { status: 502 });
    return Response.json(outcome === 'success' ? { status: 'success', is_test: 1 } : { status: 'error', err_msg: 'Rejected' });
  });
  try {
    assert.deepEqual(await refundPayTRPayment('NJ-2026-0001', '49.00', 'TESTREF'), { isTest: true });
    for (const scenario of ['rejected', 'timeout', 'invalid'] as const) {
      outcome = scenario;
      await assert.rejects(refundPayTRPayment('NJ-2026-0001', '49.00', 'TESTREF'), (error: unknown) => {
        assert.equal(refundFailureStatus(error), scenario === 'rejected' ? 'failed' : 'review');
        assert.equal(error instanceof PayTRRefundRejectedError, scenario === 'rejected');
        return true;
      });
    }
    assert.equal(refundFailureStatus(new Error('DB failed after provider success')), 'review');
    assert.equal(mock.mock.callCount(), 4);
  } finally {
    delete process.env.PAYTR_MERCHANT_ID;
    delete process.env.PAYTR_MERCHANT_KEY;
    delete process.env.PAYTR_MERCHANT_SALT;
  }
});
