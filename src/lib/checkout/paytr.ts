import { SITE } from '@/lib/config';
import crypto from 'crypto';
import type { CheckoutProvider, Order, PaymentResult } from './types';

const TOKEN_ENDPOINT = 'https://www.paytr.com/odeme/api/get-token';
const IFRAME_BASE = 'https://www.paytr.com/odeme/guvenli/';

/**
 * PayTR merchant_oid YALNIZCA harf ve rakam kabul eder (çizgi/özel karakter
 * gönderilirse token isteği reddedilir). DB'deki insan-okur sipariş numarası
 * (NJ-2026-0001) tireler atılarak gönderilir: NJ20260001.
 */
export function toPayTROid(orderNo: string): string {
  return orderNo.replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * Callback'te PayTR'den gelen merchant_oid'i (NJ20260001) DB'deki sipariş
 * numarası formatına (NJ-2026-0001) geri çevirir. Format tanınmıyorsa
 * değeri olduğu gibi döndürür (eski kayıtlar / farklı sağlayıcılar).
 */
export function fromPayTROid(oid: string): string {
  const m = /^NJ(\d{4})(\d+)$/.exec(oid);
  return m ? `NJ-${m[1]}-${m[2]}` : oid;
}

/**
 * PayTR iFrame API sağlayıcısı.
 *
 * Shopier, kendi internet sitesinde satış desteğini kaldırdığı için
 * (2026-07 itibarıyla) proje PayTR'e geçiyor. İki adımlı iFrame akışı:
 *   1. Sunucu PayTR'den iframe_token ister.
 *   2. Müşterinin önünde iframe açılır, ödeme sonucu Bildirim URL'ye (callback)
 *      POST olarak gelir.
 *
 * Kaynak: https://dev.paytr.com/iframe-api
 */
export class PayTRProvider implements CheckoutProvider {
  private merchantId: string;
  private merchantKey: string;
  private merchantSalt: string;
  private testMode: boolean;

  constructor() {
    this.merchantId = process.env.PAYTR_MERCHANT_ID ?? '';
    this.merchantKey = process.env.PAYTR_MERCHANT_KEY ?? '';
    this.merchantSalt = process.env.PAYTR_MERCHANT_SALT ?? '';
    this.testMode = process.env.PAYTR_TEST_MODE === '1';

    if (!this.merchantId || !this.merchantKey || !this.merchantSalt) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error(
          '[PayTR] PAYTR_MERCHANT_ID / PAYTR_MERCHANT_KEY / PAYTR_MERCHANT_SALT tanımlı değil. ' +
            'Vercel > Settings > Environment Variables içine ekleyin.'
        );
      }
      console.warn(
        '[PayTR] API anahtarları eksik — .env.local dosyasını kontrol edin. ' +
          '(Geliştirme modunda uyarı, production’da hata verir.)'
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async createPayment(order: Order, _randomNr: string): Promise<PaymentResult> {
    const userIp = order.userIp?.trim() || '127.0.0.1';
    // DB order_no (NJ-2026-XXXX) → PayTR'nin kabul ettiği alfanumerik biçim
    const merchantOid = toPayTROid(order.id);
    const paymentAmount = Math.round(order.total * 100); // kuruş

    const basketArray = order.items.map((i) => [
      i.name,
      i.price.toFixed(2),
      i.quantity,
    ]);
    const userBasket = Buffer.from(JSON.stringify(basketArray)).toString(
      'base64'
    );

    const noInstallment = 1; // Şimdilik tek çekim; istersek env'den ayarlanır
    const maxInstallment = 0; // 0 = yürürlükteki azami taksit sayısı
    const currency = 'TL';
    const testModeValue = this.testMode ? 1 : 0;
    const debugOn = this.testMode ? 1 : 0;

    // İmza formülü: merchant_id + user_ip + merchant_oid + email + payment_amount +
    // user_basket + no_installment + max_installment + currency + test_mode
    const hashStr =
      this.merchantId +
      userIp +
      merchantOid +
      order.customer.email +
      String(paymentAmount) +
      userBasket +
      String(noInstallment) +
      String(maxInstallment) +
      currency +
      String(testModeValue);

    const paytrToken = crypto
      .createHmac('sha256', this.merchantKey)
      .update(hashStr + this.merchantSalt)
      .digest('base64');

    const baseUrl = SITE.url;
    // Sonuç sayfasında müşteriye insan-okur numara (NJ-2026-XXXX) gösterilir.
    const merchantOkUrl = `${baseUrl}/odeme/sonuc?status=success&orderNo=${encodeURIComponent(
      order.id
    )}`;
    const merchantFailUrl = `${baseUrl}/odeme/sonuc?status=error&orderNo=${encodeURIComponent(
      order.id
    )}`;

    const body = new URLSearchParams({
      merchant_id: this.merchantId,
      user_ip: userIp,
      merchant_oid: merchantOid,
      email: order.customer.email,
      payment_amount: String(paymentAmount),
      paytr_token: paytrToken,
      user_basket: userBasket,
      debug_on: String(debugOn),
      no_installment: String(noInstallment),
      max_installment: String(maxInstallment),
      user_name: `${order.customer.name} ${order.customer.surname}`.trim(),
      user_address: order.customer.address,
      user_phone: order.customer.phone,
      merchant_ok_url: merchantOkUrl,
      merchant_fail_url: merchantFailUrl,
      timeout_limit: '30',
      currency,
      test_mode: String(testModeValue),
      lang: 'tr',
      iframe_v2: '1',
    });

    const res = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      body,
    });

    let data: unknown;
    try {
      data = (await res.json()) as unknown;
    } catch {
      throw new Error(`[PayTR] Token yanıtı okunamadı: ${res.status}`);
    }

    if (!res.ok || !isPayTRTokenSuccess(data)) {
      const reason = isPayTRTokenFailed(data)
        ? data.reason
        : `HTTP ${res.status}`;
      throw new Error(`[PayTR] Token alınamadı: ${reason}`);
    }

    return { type: 'iframe', iframeUrl: `${IFRAME_BASE}${data.token}` };
  }

  /**
   * PayTR Bildirim URL (callback) imza doğrulaması.
   *
   * Gelen hash: base64( HMAC-SHA256( merchant_oid + merchant_salt + status + total_amount ) )
   * Anahtar: merchant_key.
   */
  verifyCallback(params: Record<string, string>): boolean {
    const { merchant_oid, status, total_amount, hash } = params;
    if (!merchant_oid || !status || !total_amount || !hash) {
      return false;
    }

    const expected = crypto
      .createHmac('sha256', this.merchantKey)
      .update(merchant_oid + this.merchantSalt + status + total_amount)
      .digest('base64');

    try {
      const incoming = Buffer.from(hash, 'base64');
      const expectedBuf = Buffer.from(expected, 'base64');
      if (incoming.length !== expectedBuf.length) return false;
      return crypto.timingSafeEqual(incoming, expectedBuf);
    } catch {
      return false;
    }
  }
}

interface PayTRTokenSuccess {
  status: 'success';
  token: string;
}

interface PayTRTokenFailed {
  status: 'failed';
  reason: string;
}

function isPayTRTokenSuccess(data: unknown): data is PayTRTokenSuccess {
  return (
    typeof data === 'object' &&
    data !== null &&
    (data as Record<string, unknown>).status === 'success' &&
    typeof (data as Record<string, unknown>).token === 'string'
  );
}

function isPayTRTokenFailed(data: unknown): data is PayTRTokenFailed {
  return (
    typeof data === 'object' &&
    data !== null &&
    (data as Record<string, unknown>).status === 'failed' &&
    typeof (data as Record<string, unknown>).reason === 'string'
  );
}
