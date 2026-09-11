import crypto from 'node:crypto';
import { toPayTROid } from './paytr';

export interface PayTRRefundResult {
  amount: number | null;
  reference: string;
  completedAt: string;
}
export type PayTRStatus = { state: 'unknown' } | { state: 'paid'; amount: number; refunds: PayTRRefundResult[] };

/** PayTR status amounts are major units and can use a comma decimal separator. */
export function amountInCents(value: unknown): number | null {
  if (typeof value !== 'string' && typeof value !== 'number') return null;
  const normalized = String(value).replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  const cents = Math.round(Number(normalized) * 100);
  return Number.isSafeInteger(cents) ? cents : null;
}

function record(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

export function parsePayTRStatus(payload: unknown, expectedAmount: string, testMode: boolean): PayTRStatus {
  const result = record(payload);
  // 004 only means no SUCCESSFUL payment found. It does NOT prove a failure.
  if (result.status === 'error' && String(result.err_no) === '004') return { state: 'unknown' };
  if (result.status !== 'success') throw new Error('PayTR durum yanıtı doğrulanamadı.');
  const amount = amountInCents(result.payment_amount);
  if (amount === null || amount !== amountInCents(expectedAmount) || !['TL', 'TRY'].includes(String(result.currency))) {
    throw new Error('PayTR tutarı veya para birimi siparişle eşleşmiyor.');
  }
  if (String(result.test_mode) !== (testMode ? '1' : '0')) throw new Error('PayTR canlı/test ortamı siparişle eşleşmiyor.');
  const refunds = Array.isArray(result.returns) ? result.returns.map((entry) => {
    const item = record(entry);
    const completed = typeof item.date_completed === 'string' ? item.date_completed : '';
    return {
      amount: amountInCents(item.return_amount),
      reference: typeof item.reference_no === 'string' ? item.reference_no : '',
      // Only the documented completed date qualifies; an acceptance date doesn't.
      completedAt: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(completed) && !completed.startsWith('0000') ? completed : '',
    };
  }) : [];
  return { state: 'paid', amount, refunds };
}

export async function queryPayTRStatus(orderNo: string, expectedAmount: string): Promise<PayTRStatus> {
  const merchantId = process.env.PAYTR_MERCHANT_ID ?? '';
  const key = process.env.PAYTR_MERCHANT_KEY ?? '';
  const salt = process.env.PAYTR_MERCHANT_SALT ?? '';
  if (!merchantId || !key || !salt) throw new Error('PayTR durum sorgusu yapılandırılmamış.');
  const oid = toPayTROid(orderNo);
  const token = crypto.createHmac('sha256', key).update(merchantId + oid + salt).digest('base64');
  const response = await fetch('https://www.paytr.com/odeme/durum-sorgu', {
    method: 'POST', body: new URLSearchParams({ merchant_id: merchantId, merchant_oid: oid, paytr_token: token }),
    cache: 'no-store', signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) throw new Error('PayTR durum sorgusuna ulaşılamadı.');
  return parsePayTRStatus(await response.json(), expectedAmount, process.env.PAYTR_TEST_MODE === '1');
}
