import { SITE } from '@/lib/config';
import type { Metadata } from 'next';
import HomeClient from './HomeClient';
import { getCatalogProducts } from '@/lib/catalog';

/**
 * Ana sayfanın canonical'ı BURADA tanımlanır.
 *
 * Eskiden layout.tsx içinde `alternates: { canonical: '/' }` vardı. Next.js
 * metadata'yı parent'tan miras verdiği için, kendi canonical'ını tanımlamayan
 * HER sayfa ana sayfayı işaret ediyordu — kategori sayfaları dahil. Sonuç:
 * Google'a hem "beni indeksle" hem "ben ana sayfayım" deniyordu ve o sayfalar
 * indeksten düşüyordu. Canonical artık sayfa bazında verilir, layout'ta değil.
 */
export const metadata: Metadata = {
  alternates: { canonical: SITE.url },
};

export const revalidate = 60;

export default async function HomePage() {
  const products = await getCatalogProducts();
  return <HomeClient products={products} />;
}
