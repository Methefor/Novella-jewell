import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sealCheckoutSession, readCheckoutSession, type CheckoutSession } from '../src/lib/checkout/session';
import { checkoutStatusResponse } from '../src/lib/checkout/status-response';
import { readReceipt, sealReceipt } from '../src/lib/checkout/receipt';

const secret = 'test-only-key-never-a-provider-credential';
const now = Date.now();
const session: CheckoutSession = { orderNo: 'NJ-2026-0003', verify: 'a'.repeat(48), iframeUrl: 'https://www.paytr.com/odeme/guvenli/abcdef123456', issuedAt: now };

test('reload checks pending state without reopening a consumed token, and follows terminal outcomes', () => {
  const pending = checkoutStatusResponse({ status: 'pending', total: '99.90' }, session);
  assert.deepEqual(pending, { type: 'pending', orderNo: session.orderNo, total: 99.9 });
  assert.equal('iframeUrl' in pending, false);
  assert.deepEqual(checkoutStatusResponse({ status: 'failed', total: '99.90' }, session), { type: 'none', previousFailed: true });
  const paid = checkoutStatusResponse({ status: 'paid', total: '99.90' }, session);
  assert.equal(paid.type, 'redirect');
  assert.equal(paid.redirectUrl, '/odeme/sonuc?status=success&orderNo=NJ-2026-0003');
  assert.equal(paid.redirectUrl!.includes(session.verify), false);
});

test('private receipt reference is signed, expires and rejects forgery', () => {
  const cookie = sealReceipt(session.orderNo, session.verify, secret, now);
  assert.equal(readReceipt(cookie, secret, now + 1000)?.verify, session.verify);
  assert.equal(readReceipt(cookie, 'wrong', now), null);
  assert.equal(readReceipt(cookie + 'x', secret, now), null);
  assert.equal(readReceipt(cookie, secret, now + 86401_000), null);
  assert.equal(readReceipt(cookie, secret, now - 1000), null);
});

test('signed checkout reference survives reload for ownership and status checks', () => {
  const cookie = sealCheckoutSession(session, secret);
  assert.deepEqual(readCheckoutSession(cookie, secret, now + 60_000), session);
  assert.deepEqual(readCheckoutSession(cookie, secret, now + 120_000), session);
});

test('provider tokens remain opaque and survive signing without being changed', () => {
  for (const token of ['abc-def_123', 'abc+def/123==', 'abc.def%2B123%3D']) {
    const payment = { ...session, iframeUrl: `https://www.paytr.com/odeme/guvenli/${token}` };
    assert.deepEqual(readCheckoutSession(sealCheckoutSession(payment, secret), secret, now), payment);
  }
});

test('changed order, forged signature, wrong key and malformed cookie cannot resume a payment', () => {
  const cookie = sealCheckoutSession(session, secret);
  const [, signature] = cookie.split('.');
  const changed = Buffer.from(JSON.stringify({ ...session, orderNo: 'NJ-2026-0004' })).toString('base64url');
  assert.equal(readCheckoutSession(`${changed}.${signature}`, secret, now), null);
  assert.equal(readCheckoutSession(cookie, 'another-key', now), null);
  for (const value of [undefined, '', 'a.b', cookie + '.extra', 'x'.repeat(3000)]) {
    assert.equal(readCheckoutSession(value, secret, now), null);
  }
});

test('expired or future checkout cookie is rejected and only a PayTR payment URL is allowed', () => {
  assert.equal(readCheckoutSession(sealCheckoutSession(session, secret), secret, now + 86_401_000), null);
  assert.equal(readCheckoutSession(sealCheckoutSession({ ...session, issuedAt: now + 120_000 }, secret), secret, now), null);
  for (const iframeUrl of ['https://evil.example/pay', 'https://www.paytr.com.evil.example/odeme/guvenli/abc', 'https://www.paytr.com/odeme/guvenli/abc?redirect=evil', 'https://www.paytr.com/odeme/guvenli/../../../evil', 'https://www.paytr.com/odeme/guvenli/', 'https://www.paytr.com/odeme/guvenli/abc#fragment', 'https://user@www.paytr.com/odeme/guvenli/abc', 'javascript:alert(1)']) {
    assert.throws(() => sealCheckoutSession({ ...session, iframeUrl }, secret));
  }
  assert.throws(() => sealCheckoutSession(session, ''));
});
