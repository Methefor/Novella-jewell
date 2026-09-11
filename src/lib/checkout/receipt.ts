import { createHmac, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';

export const RECEIPT_COOKIE = 'novella_receipt';
export const RECEIPT_MAX_AGE = 24 * 60 * 60;
export const receiptCookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/api/odeme', maxAge: RECEIPT_MAX_AGE };
const schema = z.object({ orderNo: z.string().regex(/^NJ-\d{4}-\d+$/), verify: z.string().regex(/^[a-f0-9]{48}$/), issuedAt: z.number() });
export function sealReceipt(orderNo: string, verify: string, key: string, now = Date.now()) {
  if (!key) throw new Error('Receipt signing unavailable');
  const payload = Buffer.from(JSON.stringify(schema.parse({ orderNo, verify, issuedAt: now }))).toString('base64url');
  const mac = createHmac('sha256', key).update(`receipt.v1:${payload}`).digest('base64url');
  return `${payload}.${mac}`;
}
export function readReceipt(value: string | undefined, key: string, now = Date.now()) {
  if (!value || !key || value.length > 1000) return null;
  try {
    const [payload, signature, extra] = value.split('.');
    if (!payload || !signature || extra) return null;
    const expected = createHmac('sha256', key).update(`receipt.v1:${payload}`).digest();
    const actual = Buffer.from(signature, 'base64url');
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
    const receipt = schema.parse(JSON.parse(Buffer.from(payload, 'base64url').toString()));
    if (receipt.issuedAt > now || now - receipt.issuedAt > RECEIPT_MAX_AGE * 1000) return null;
    return receipt;
  } catch { return null; }
}
