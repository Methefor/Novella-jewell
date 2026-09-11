import CategoryClient from '@/app/collections/[category]/CategoryClient';
import { getCatalogProducts } from '@/lib/catalog';
import { searchCatalogProducts } from '@/lib/catalog-search';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Arama Sonuçları', robots: { index: false, follow: true } };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const term = typeof q === 'string' ? q.trim().slice(0, 120) : '';
  const products = searchCatalogProducts(await getCatalogProducts(), term);
  return <CategoryClient key={term} category="tum-urunler" products={products} searchTerm={term} />;
}
