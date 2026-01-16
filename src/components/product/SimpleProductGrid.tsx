/**
 * NOVELLA - Simple Product Grid
 * Basit ürün grid görünümü (filtreleme olmadan)
 */

'use client';

import { NovellaProduct } from '@/lib/sanity.types';
import ProductCard from './ProductCard';

interface SimpleProductGridProps {
  products: NovellaProduct[];
  columns?: 2 | 3 | 4;
}

export default function SimpleProductGrid({
  products,
  columns = 4,
}: SimpleProductGridProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-white/60 text-lg">Ürün bulunamadı</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
