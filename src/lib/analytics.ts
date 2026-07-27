import type { Product } from '@/types/product';
import { getConsent } from '@/lib/cookies';

/**
 * GA4 e-ticaret olay izleme.
 *
 * Amaç: reklam/pazarlama fazında dönüşüm hunisini görebilmek. Sadece sayfa
 * görüntüleme değil; ürün görüntüleme → sepete ekleme → ödeme başlatma →
 * satın alma zinciri izlenir. Böylece "reklam tıklandı ama sepete eklenmedi"
 * gibi kayıpların nerede olduğu görülür.
 *
 * Güvenli: gtag yüklü değilse (çerez izni yok veya NEXT_PUBLIC_GA_ID boş)
 * hiçbir şey yapmaz, hata fırlatmaz. Yani site GA olmadan da sorunsuz çalışır;
 * gerçek GA ID girildiğinde olaylar kendiliğinden akmaya başlar.
 *
 * GA4 önerilen olay adları kullanılır (view_item, add_to_cart,
 * begin_checkout, purchase) — GA arayüzü bunları otomatik tanır.
 */

type GtagArgs = [string, string, Record<string, unknown>?];

function gtag(...args: GtagArgs): void {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { gtag?: (...a: GtagArgs) => void };
  if (typeof w.gtag !== 'function') return; // GA yüklü değil → sessizce çık
  w.gtag(...args);
}

type FirstPartyEventName =
  | 'page_view'
  | 'view_item'
  | 'add_to_cart'
  | 'begin_checkout';

export function trackFirstPartyEvent(
  eventName: FirstPartyEventName,
  input: {
    productId?: string;
    value?: number;
    metadata?: Record<string, string | number | boolean | null>;
  } = {}
): void {
  if (typeof window === 'undefined' || getConsent() !== 'accepted') return;
  const sessionKey = 'novella_analytics_session';
  let sessionId = window.sessionStorage.getItem(sessionKey);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    window.sessionStorage.setItem(sessionKey, sessionId);
  }
  const url = new URL(window.location.href);
  const referrer = document.referrer ? new URL(document.referrer) : null;
  const source =
    url.searchParams.get('utm_source') ??
    (referrer && referrer.hostname !== window.location.hostname
      ? referrer.hostname
      : 'direct');
  const body = JSON.stringify({
    sessionId,
    eventName,
    productId: input.productId ?? null,
    value: input.value ?? null,
    path: `${url.pathname}${url.search}`,
    source,
    medium: url.searchParams.get('utm_medium') ?? (source === 'direct' ? 'none' : 'referral'),
    campaign: url.searchParams.get('utm_campaign'),
    referrerHost: referrer?.hostname ?? null,
    metadata: input.metadata ?? {},
    occurredAt: new Date().toISOString(),
  });
  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      '/api/analytics/events',
      new Blob([body], { type: 'application/json' })
    );
  } else {
    void fetch('/api/analytics/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    });
  }
}

/** Ürünü GA4 item formatına çevirir. */
function toItem(product: Product, quantity = 1) {
  return {
    item_id: product.id,
    item_name: product.name,
    item_category: product.category,
    item_brand: 'NOVELLA',
    price: product.price,
    quantity,
  };
}

/** Ürün detay sayfası açıldığında. */
export function trackViewItem(product: Product): void {
  trackFirstPartyEvent('view_item', {
    productId: product.id,
    value: product.price,
  });
  gtag('event', 'view_item', {
    currency: 'TRY',
    value: product.price,
    items: [toItem(product)],
  });
}

/** Sepete eklendiğinde. */
export function trackAddToCart(product: Product, quantity = 1): void {
  trackFirstPartyEvent('add_to_cart', {
    productId: product.id,
    value: product.price * quantity,
    metadata: { quantity },
  });
  gtag('event', 'add_to_cart', {
    currency: 'TRY',
    value: product.price * quantity,
    items: [toItem(product, quantity)],
  });
}

/** Ödeme sayfasına geçildiğinde. */
export function trackBeginCheckout(value: number, items: Product[]): void {
  trackFirstPartyEvent('begin_checkout', {
    value,
    metadata: { itemCount: items.length },
  });
  gtag('event', 'begin_checkout', {
    currency: 'TRY',
    value,
    items: items.map((p) => toItem(p)),
  });
}

/**
 * Satın alma tamamlandığında. transactionId GA'da tekrarları eler
 * (aynı sipariş sayfası yenilenirse çift sayılmaz).
 */
export function trackPurchase(
  transactionId: string,
  value: number
): void {
  gtag('event', 'purchase', {
    transaction_id: transactionId,
    currency: 'TRY',
    value,
  });
}
