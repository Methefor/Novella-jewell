import type { Product } from '@/types/product';
import type { VerifiedPurchase } from '@/lib/purchase-event';
import { purchaseEvent } from '@/lib/purchase-event';
import type { CartItem } from '@/store/cartStore';
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

function gtag(...args: GtagArgs): boolean {
  if (typeof window === 'undefined' || getConsent() !== 'accepted') return false;
  const w = window as unknown as { gtag?: (...a: GtagArgs) => void };
  if (typeof w.gtag !== 'function') return false; // GA yüklü değil → sessizce çık
  w.gtag(args[0], args[1], { ...args[2], page_location: `${window.location.origin}${window.location.pathname}` });
  return true;
}

function metaTrack(
  eventName: 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'Purchase',
  parameters: Record<string, unknown>
): boolean {
  if (typeof window === 'undefined' || getConsent() !== 'accepted') return false;
  const fbq = (window as typeof window & {
    fbq?: (...args: unknown[]) => void;
  }).fbq;
  if (typeof fbq !== 'function') return false;
  fbq('track', eventName, parameters);
  return true;
}

type FirstPartyEventName =
  | 'page_view'
  | 'view_item'
  | 'add_to_cart'
  | 'view_cart'
  | 'remove_from_cart'
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
    path: url.pathname,
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
  metaTrack('ViewContent', {
    content_ids: [product.id],
    content_name: product.name,
    content_category: product.category,
    content_type: 'product',
    currency: 'TRY',
    value: product.price,
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
  metaTrack('AddToCart', {
    content_ids: [product.id],
    content_name: product.name,
    content_category: product.category,
    content_type: 'product',
    currency: 'TRY',
    value: product.price * quantity,
    num_items: quantity,
  });
}

/** Sepet sayfası görüntülendiğinde. */
export function trackViewCart(value: number, items: Pick<CartItem, 'product' | 'quantity'>[]): void {
  trackFirstPartyEvent('view_cart', {
    value,
    metadata: { itemCount: items.reduce((n, i) => n + i.quantity, 0) },
  });
  gtag('event', 'view_cart', {
    currency: 'TRY',
    value,
    items: items.map((item) => toItem(item.product, item.quantity)),
  });
}

/** Ürün sepetten tamamen çıkarıldığında. */
export function trackRemoveFromCart(
  product: Product,
  quantity = 1
): void {
  trackFirstPartyEvent('remove_from_cart', {
    productId: product.id,
    value: product.price * quantity,
    metadata: { quantity },
  });
  gtag('event', 'remove_from_cart', {
    currency: 'TRY',
    value: product.price * quantity,
    items: [toItem(product, quantity)],
  });
}

/** Ödeme sayfasına geçildiğinde. */
export function trackBeginCheckout(value: number, items: Pick<CartItem, 'product' | 'quantity'>[]): void {
  trackFirstPartyEvent('begin_checkout', {
    value,
    metadata: { itemCount: items.reduce((n, i) => n + i.quantity, 0) },
  });
  gtag('event', 'begin_checkout', {
    currency: 'TRY',
    value,
    items: items.map((item) => toItem(item.product, item.quantity)),
  });
  metaTrack('InitiateCheckout', {
    content_ids: items.map((item) => item.product.id),
    content_type: 'product',
    currency: 'TRY',
    value,
    num_items: items.reduce((n, i) => n + i.quantity, 0),
  });
}

/**
 * Satın alma tamamlandığında. transactionId GA'da tekrarları eler
 * (aynı sipariş sayfası yenilenirse çift sayılmaz).
 */
export function trackPurchase(transactionId: string, purchase: VerifiedPurchase): void {
  if (typeof window === 'undefined' || getConsent() !== 'accepted') return;
  const event = purchaseEvent(transactionId, purchase);
  for (const platform of ['ga', 'meta'] as const) {
    const key = `novella_${platform}_purchase_${transactionId}`;
    let sent = false;
    try { sent = window.localStorage.getItem(key) === '1'; } catch { /* storage optional */ }
    if (sent) continue;
    const delivered = platform === 'ga'
      ? gtag('event', 'purchase', event)
      : metaTrack('Purchase', { currency: 'TRY', value: purchase.total, order_id: transactionId,
          content_ids: event.items.map((i) => i.item_id), content_type: 'product',
          contents: event.items.map((i) => ({ id: i.item_id, quantity: i.quantity, item_price: i.price })),
          num_items: event.items.reduce((n, i) => n + i.quantity, 0) });
    if (delivered) { try { window.localStorage.setItem(key, '1'); } catch { /* GA transaction_id still deduplicates */ } }
  }
}
