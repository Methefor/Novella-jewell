import crypto from 'node:crypto';
import { z } from 'zod';

export const CHECKOUT_COOKIE = 'novella_checkout';
export const CHECKOUT_COOKIE_MAX_AGE = 24 * 60 * 60;

const sessionSchema = z.object({
  orderNo: z.string().regex(/^NJ-\d{4}-\d+$/),
  verify: z.string().regex(/^[a-f0-9]{48}$/),
  iframeUrl: z.string().max(1024).url().refine((value) => {
    const url = new URL(value);
    // The provider token is opaque; it is not constrained like merchant_oid.
    // Bind the signed URL to the PayTR payment endpoint without guessing the
    // token alphabet (which may include URL/base64 separators or padding).
    const paymentPath = '/odeme/guvenli/';
    return url.origin === 'https://www.paytr.com'
      && value.startsWith(`https://www.paytr.com${paymentPath}`)
      && url.pathname.startsWith(paymentPath) && url.pathname.length > paymentPath.length
      && !url.search && !url.hash && !url.username && !url.password;
  }),
  issuedAt: z.number().int().positive(),
});

export type CheckoutSession = z.infer<typeof sessionSchema>;

/** The browser keeps only a signed, HttpOnly reference to its existing payment. */
export function sealCheckoutSession(session: CheckoutSession, secret: string): string {
  if (!secret) throw new Error('Checkout signing key unavailable');
  const payload = Buffer.from(JSON.stringify(sessionSchema.parse(session))).toString('base64url');
  const signature = crypto.createHmac('sha256', secret)
    .update(`novella-checkout.v1:${payload}`).digest('base64url');
  return `${payload}.${signature}`;
}

export function readCheckoutSession(value: string | undefined, secret: string, now = Date.now()): CheckoutSession | null {
  if (!value || !secret || value.length > 2000) return null;
  try {
    const [payload, signature, extra] = value.split('.');
    if (!payload || !signature || extra) return null;
    const expected = crypto.createHmac('sha256', secret)
      .update(`novella-checkout.v1:${payload}`).digest();
    const received = Buffer.from(signature, 'base64url');
    if (received.length !== expected.length || !crypto.timingSafeEqual(received, expected)) return null;
    const session = sessionSchema.parse(JSON.parse(Buffer.from(payload, 'base64url').toString()));
    if (session.issuedAt > now + 60_000 || now - session.issuedAt > CHECKOUT_COOKIE_MAX_AGE * 1000) return null;
    return session;
  } catch { return null; }
}
