import crypto from 'crypto';
import { SITE } from '@/lib/config';
import type { CheckoutProvider, Order, PaymentResult } from './types';

const API_ENDPOINT = 'https://www.shopier.com/ShowProduct/api_pay4.php';
const MODULE_VERSION = '1.0.4';

/** HMAC-SHA256 → base64 (Shopier'in beklediği format). */
function sign(data: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(data).digest('base64');
}

/**
 * Currency kodu. Shopier: 0 = TRY, 1 = USD, 2 = EUR.
 * Bu değer HEM form alanında HEM imzada AYNI kullanılmalı; yoksa Shopier'in
 * sunucusu imzayı yeniden hesaplarken tutmaz ve ödeme reddedilir.
 */
const CURRENCY_TRY = '0';

export class ShopierProvider implements CheckoutProvider {
  private apiKey: string;
  private apiSecret: string;
  private websiteIndex: string;

  constructor() {
    // ⚠️ NEXT_PUBLIC_ öneki KULLANILMAZ. O önek değeri client bundle'ına gömer
    // ve API secret'ı herkese açık hale getirir. Bunlar sunucuda okunur.
    this.apiKey = process.env.SHOPIER_API_KEY ?? '';
    this.apiSecret = process.env.SHOPIER_API_SECRET ?? '';
    this.websiteIndex = process.env.SHOPIER_WEBSITE_INDEX ?? '1';

    if (!this.apiKey || !this.apiSecret) {
      // Production'da sessizce devam etmek en kötüsü: boş secret'la imzalanan
      // her ödeme Shopier tarafından reddedilir ve müşteri sebebini anlamaz.
      // Gürültülü çökmek, sessizce satış kaybetmekten iyidir.
      if (process.env.NODE_ENV === 'production') {
        throw new Error(
          '[Shopier] SHOPIER_API_KEY / SHOPIER_API_SECRET tanımlı değil. ' +
            'Vercel > Settings > Environment Variables içine ekleyin.'
        );
      }
      console.warn(
        '[Shopier] API anahtarları eksik — .env.local dosyasını kontrol edin. ' +
          '(Geliştirme modunda uyarı, production’da hata verir.)'
      );
    }
  }

  async createPayment(order: Order, randomNr: string): Promise<PaymentResult> {
    // randomNr çağırandan gelir (checkout route) — aynı değer DB pending
    // siparişe kaydedildi ve imzada kullanılıyor.
    const productName = order.items.map((i) => i.name).join(', ').slice(0, 80);
    const totalStr = order.total.toFixed(2);

    /**
     * ⚠️ İMZA FORMÜLÜ — Shopier'in resmî akışı.
     *   sign = base64( HMAC-SHA256( random_nr + platform_order_id + total_order_value + currency ) )
     *
     * Bu sıra iki bağımsız resmî-uyumlu SDK ile birebir doğrulandı
     * (erkineren/shopier · canavci2016/shopier). Bu dört alan DIŞINDA hiçbir
     * şey (api_key, website_index, product_name, product_type) imzaya girmez.
     *
     * ⚠️ İmzadaki her değer, aşağıdaki form alanında GÖNDERİLEN değerle
     * BİREBİR aynı string olmalı — Shopier sunucusu imzayı form değerlerinden
     * yeniden hesaplıyor. random_nr, platform_order_id, total_order_value ve
     * currency dördü de eşleşmeli.
     */
    const sigData = randomNr + order.id + totalStr + CURRENCY_TRY;
    const signature = sign(sigData, this.apiSecret);

    const callbackBase = SITE.url;

    // Shopier POST form parametreleri
    const params: Record<string, string> = {
      API_key: this.apiKey,
      website_index: this.websiteIndex,
      platform_order_id: order.id,
      product_name: productName,
      product_type: '0',
      buyer_name: order.customer.name,
      buyer_surname: order.customer.surname,
      buyer_email: order.customer.email,
      buyer_phone_number: order.customer.phone,
      buyer_account_age: '0',
      buyer_history_order_count: '0',
      buyer_history_sentpackage_count: '0',
      total_order_value: totalStr, // imzayla AYNI string
      currency: CURRENCY_TRY, // imzayla AYNI değer
      platform: '0',
      is_in_frame: '0',
      current_language: 'tr',
      modul_version: MODULE_VERSION,
      random_nr: randomNr, // imzayla AYNI string
      signature,
      // Kargo adresi
      shipping_full_name: `${order.customer.name} ${order.customer.surname}`,
      shipping_address: order.customer.address,
      shipping_city: order.customer.city,
      shipping_country: 'TR',
      // Callback
      callback_url: `${callbackBase}/api/odeme/callback`,
    };

    // Otomatik submit olacak form HTML'i oluştur
    const inputs = Object.entries(params)
      .map(([k, v]) => `<input type="hidden" name="${k}" value="${v.replace(/"/g, '&quot;')}" />`)
      .join('\n');

    const formHtml = `
<form id="shopier-form" method="POST" action="${API_ENDPOINT}">
  ${inputs}
</form>
<script>document.getElementById('shopier-form').submit();</script>`;

    return { type: 'form', formHtml };
  }

  /**
   * ⚠️ CALLBACK İMZA DOĞRULAMA — Shopier'in resmî akışı.
   *   expected = HMAC-SHA256( random_nr + platform_order_id )   [ham binary]
   *   gelen signature base64-DECODE edilip expected ile karşılaştırılır.
   *
   * İki bağımsız SDK ile birebir doğrulandı. Dikkat:
   *  - Alan sırası: random_nr ÖNCE, platform_order_id SONRA.
   *  - payment_status/status İMZAYA GİRMEZ (eski kod yanlışlıkla ekliyordu).
   *  - Karşılaştırma HAM BINARY üzerinden; gelen base64 decode edilir.
   *  - timingSafeEqual: zamanlama saldırısına karşı sabit süreli karşılaştırma.
   */
  verifyCallback(params: Record<string, string>): boolean {
    const { platform_order_id, random_nr, signature } = params;
    if (!platform_order_id || !random_nr || !signature) {
      return false;
    }

    const expected = crypto
      .createHmac('sha256', this.apiSecret)
      .update(random_nr + platform_order_id)
      .digest(); // Buffer (ham binary)

    let incoming: Buffer;
    try {
      incoming = Buffer.from(signature, 'base64');
    } catch {
      return false;
    }

    if (incoming.length !== expected.length) return false;
    return crypto.timingSafeEqual(incoming, expected);
  }
}
