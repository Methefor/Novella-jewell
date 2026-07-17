'use client';

import ProductCard from '@/components/product/ProductCard';
import { getAllProducts } from '@/lib/products';
import type { Product } from '@/types/product';

interface Props {
  baslik?: string;
  /** Kaç ürün gösterilsin */
  adet?: number;
}

/**
 * Öneri şeridi — boş sepet/favori ekranlarında kullanıcıyı ürüne yönlendirir.
 * Yeni gelenlerden seçer; yoksa ilk ürünlerle doldurur.
 */
export default function OneriSeridi({
  baslik = 'Belki bunlar ilgini çeker',
  adet = 4,
}: Props) {
  const tumu = getAllProducts();
  const yeniler = tumu.filter((p) => p.isNew);
  const havuz: Product[] = (yeniler.length >= adet ? yeniler : tumu)
    .slice(0, adet);

  if (havuz.length === 0) return null;

  return (
    <div className="w-full max-w-5xl mx-auto mt-16 text-left">
      <h2 className="section-label mb-6 text-center">{baslik}</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {havuz.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
