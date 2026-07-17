import type { Product } from '@/types/product';

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
  gtag('event', 'view_item', {
    currency: 'TRY',
    value: product.price,
    items: [toItem(product)],
  });
}

/** Sepete eklendiğinde. */
export function trackAddToCart(product: Product, quantity = 1): void {
  gtag('event', 'add_to_cart', {
    currency: 'TRY',
    value: product.price * quantity,
    items: [toItem(product, quantity)],
  });
}

/** Ödeme sayfasına geçildiğinde. */
export function trackBeginCheckout(value: number, items: Product[]): void {
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
