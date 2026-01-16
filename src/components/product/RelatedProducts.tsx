'use client';

import SimpleProductGrid from '@/components/product/SimpleProductGrid';
import { getRelatedProducts } from '@/data/products';

interface RelatedProductsProps {
  currentProductId: string;
  category: string;
}

export default function RelatedProducts({
  currentProductId,
  category,
}: RelatedProductsProps) {
  const products = getRelatedProducts(currentProductId, category, 4);

  if (products.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="font-serif text-2xl lg:text-3xl text-white mb-8">
        Benzer Ürünler
      </h2>
      <SimpleProductGrid products={products} columns={4} />
    </section>
  );
}
