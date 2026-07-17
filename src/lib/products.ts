// Tek veri erişim noktası.
// Supabase'e geçişte sadece bu dosya değişir — sayfalar dokunulmaz.
import { LOW_STOCK_THRESHOLD } from '@/lib/config';
import type { Product } from '@/types/product';

export {
  getAllProducts,
  getProductBySlug,
  getProductsByCategory,
  getProductsByCollection,
  getNewProducts,
  getBestSellers,
  getRelatedProducts,
} from '@/data/products';

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
