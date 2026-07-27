import CategoryClient from '@/app/collections/[category]/CategoryClient';
import { getCatalogProducts } from '@/lib/catalog';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tüm Ürünler | Novella Jewell',
  description:
    'Novella Jewell yüzük, küpe ve bileklik koleksiyonlarını keşfedin. Suya dayanıklı, kararmaya dirençli ve ulaşılabilir premium takılar.',
  alternates: {
    canonical: '/urunler',
  },
};

export default async function ProductsPage() {
  const products = await getCatalogProducts();

  return <CategoryClient category="tum-urunler" products={products} />;
}
