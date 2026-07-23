// Sepet ve ürün önerileri — kargo eşiği stratejisinin kalbi.
// 499₺'lik sepeti 500₺ üzerine taşıyacak ürünleri akıllıca seçer.

import { SHIPPING } from '@/lib/config';
import { getAllProducts, toplamStok } from '@/lib/products';
import type { Product } from '@/types/product';

/**
 * Ücretsiz kargo eşiğini tamamlayacak ürünleri önerir.
 *
 * Sıralama mantığı:
 *   1. Eşiği tek başına aşan ürünler, en ucuzdan pahalıya — müşteri
 *      "1₺ için 49.90₺ kargo mu ödeyeyim?" ikileminde en küçük ek harcamayla
 *      eşiği geçsin.
 *   2. Eşiği aşamayanlar (yedek), en pahalıdan ucuza — eşiğe en çok yaklaştıran önce.
 *
 * @param subtotal      Sepet ara toplamı
 * @param sepettekiIdler Sepetteki ürün id'leri (tekrar önerilmez)
 */
export function kargoTamamlayicilar(
  subtotal: number,
  sepettekiIdler: string[],
  adet = 4
): Product[] {
  const eksik = SHIPPING.freeThreshold - subtotal;
  if (eksik <= 0 || subtotal === 0) return [];

  const adaylar = getAllProducts().filter(
    (p) => !sepettekiIdler.includes(p.id) && toplamStok(p) > 0
  );

  const asanlar = adaylar
    .filter((p) => p.price >= eksik)
    .sort((a, b) => a.price - b.price);
  const yaklastiranlar = adaylar
    .filter((p) => p.price < eksik)
    .sort((a, b) => b.price - a.price);

  return [...asanlar, ...yaklastiranlar].slice(0, adet);
}
