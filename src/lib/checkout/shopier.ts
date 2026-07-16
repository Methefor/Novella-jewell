import crypto from 'crypto';
import { SITE } from '@/lib/config';
import type { CheckoutProvider, Order, PaymentResult } from './types';

const API_ENDPOINT = 'https://www.shopier.com/ShowProduct/api_pay4.php';
const MODULE_VERSION = '1.0.4';

function sign(data: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(data).digest('base64');
}

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

  async createPayment(order: Order): Promise<PaymentResult> {
    const randomNr = Math.floor(Math.random() * 900000) + 100000; // 6 haneli
    const productName = order.items.map((i) => i.name).join(', ').slice(0, 80);

    // İmza verisi: API_key + website_index + platform_order_id + product_name + product_type + total_order_value + currency + random_nr
    const sigData =
      this.apiKey +
      this.websiteIndex +
      order.id +
      productName +
      '0' + // product_type: 0 = diğer
      order.total.toFixed(2) +
      '0' + // currency: 0 = TRY
      randomNr;

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
      total_order_value: order.total.toFixed(2),
      currency: '0', // TRY
      platform: '0',
      is_in_frame: '0',
      current_language: 'tr',
      modul_version: MODULE_VERSION,
      random_nr: String(randomNr),
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

  verifyCallback(params: Record<string, string>): boolean {
    const { platform_order_id, payment_status, random_nr, signature } = params;
    if (!platform_order_id || !payment_status || !random_nr || !signature) {
      return false;
    }
    const expected = sign(
      platform_order_id + payment_status + random_nr,
      this.apiSecret
    );
    return expected === signature;
  }
}
