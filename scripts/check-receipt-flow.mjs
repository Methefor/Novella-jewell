import nextEnv from '@next/env';
import { neon } from '@neondatabase/serverless';
import assert from 'node:assert/strict';

// Read-only verification against an already paid order. Never loads the browser
// success page, sends analytics, changes stock, charges a card or issues a refund.
nextEnv.loadEnvConfig(process.cwd(), false);
const orderNo = process.argv[2];
if (!/^NJ-\d{4}-\d+$/.test(orderNo ?? '')) throw new Error('Order number required');
const sql = neon(process.env.DATABASE_URL);
const [order] = await sql`SELECT random_nr, total FROM orders WHERE order_no=${orderNo} AND status='paid'`;
if (!order) throw new Error('Paid fixture not found');
const base = 'https://novellajewell.com';
try {
  const response = await fetch(`${base}/api/odeme/return?orderNo=${encodeURIComponent(orderNo)}&verify=${encodeURIComponent(order.random_nr)}`, { redirect: 'manual' });
  assert.equal(response.status, 307);
  const location = response.headers.get('location');
  assert.ok(location?.includes('/odeme/sonuc?status=success'));
  assert.equal(location.includes(order.random_nr), false);
  const cookie = response.headers.getSetCookie().find((value) => value.startsWith('novella_receipt='));
  assert.ok(cookie && /httponly/i.test(cookie) && /secure/i.test(cookie));
  const verified = await fetch(`${base}/api/odeme/dogrula?orderNo=${orderNo}`, { headers: { Cookie: cookie.split(';')[0] } });
  const result = await verified.json();
  assert.equal(verified.status, 200);
  assert.equal(result.status, 'paid');
  assert.equal(result.total, order.total);
  const anonymous = await fetch(`${base}/api/odeme/dogrula?orderNo=${orderNo}`);
  assert.equal(anonymous.status, 400);
  console.log('PASS: private reference exchanged for Secure/HttpOnly receipt; clean redirect, authenticated paid verification and anonymous rejection. No payment/refund/email initiated.');
} catch {
  console.error('FAIL: receipt flow verification; private reference withheld.');
  process.exitCode = 1;
}
