import ProductsClient from '@/components/ProductsClient';
import { getAllCategories, getAllProducts } from '@/lib/products';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Tüm Ürünler | NOVELLA',
  description: 'NOVELLA premium çelik takı koleksiyonunu keşfedin. Kolye, bilezik, küpe ve yüzükler.',
};

export default async function ProductsPage() {
  // For now, we'll use fallback data if Sanity is not configured
  // In production, this will fetch from Sanity
  let products = [];
  let categories: string[] = [];
  
  try {
    products = await getAllProducts();
    categories = await getAllCategories();
  } catch (error) {
    console.error('Error loading products:', error);
    // Fallback to empty array - will show empty state
    categories = ['Kolye', 'Bilezik', 'Küpe', 'Yüzük'];
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-cormorant text-5xl font-bold text-white md:text-6xl">
            Tüm Ürünler
          </h1>
          <p className="mx-auto max-w-2xl font-inter text-lg text-white/60">
            Premium kalitede çelik takı koleksiyonumuzu keşfedin
          </p>
        </div>

        {/* Products with Filters */}
        <Suspense fallback={<ProductsLoading />}>
          <ProductsClient initialProducts={products} categories={categories} />
        </Suspense>
      </div>
    </div>
  );
}

function ProductsLoading() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="glass h-[400px] animate-pulse rounded-2xl bg-white/5"
        />
      ))}
    </div>
  );
}

