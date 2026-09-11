// Tek veri erişim noktası.
// Ürün erişimi bu modülde merkezileştirilir; kalıcı katalog Neon DB'dedir.
import { LOW_STOCK_THRESHOLD } from '@/lib/config';
import type { Product } from '@/types/product';

/** Keep the preferred variant when available; never offer an unavailable variant for purchase. */
export function getPurchasableVariant(product: Product) {
  return product.variants.find((variant) => variant.id === product.defaultVariant && variant.stock > 0)
    ?? product.variants.find((variant) => variant.stock > 0);
}

export const OUT_OF_STOCK_LABEL = 'Stokta yok · Yakında gelecek';

// Storefront reads use lib/catalog on the server and useCatalogProducts in clients.

/** Bir ürünün tüm varyantlarındaki toplam stok. */
export function toplamStok(product: Product): number {
  return product.variants.reduce((t, v) => t + v.stock, 0);
}

/**
 * Düşük stok göstergesi gösterilmeli mi ve kaç adet?
 * `goster: false` ise hiç gösterme. Tükenmiş ürünlerde de gösterilmez
 * (o ayrı bir durum — "tükendi" mesajı).
 */
export function dusukStok(product: Product): { goster: boolean; adet: number } {
  const adet = toplamStok(product);
  return { goster: adet > 0 && adet <= LOW_STOCK_THRESHOLD, adet };
}
