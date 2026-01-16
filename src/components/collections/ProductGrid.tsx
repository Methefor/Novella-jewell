/**
 * NOVELLA - Product Grid Component (Collections)
 * Filtrelenmiş ürünleri grid layout'ta gösterir
 */

'use client';

import ProductCard from '@/components/product/ProductCard';
import { NovellaProduct } from '@/lib/sanity.types';
import { useFilterStore } from '@/store/filterStore';
import { useMemo } from 'react';

interface ProductGridProps {
  products: NovellaProduct[];
  isLoading?: boolean;
}

export default function ProductGrid({ products, isLoading = false }: ProductGridProps) {
  const filterStore = useFilterStore();

  // Filtreleme ve sıralama logic
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // 1. Kategori filtresi
    if (filterStore.categories.length > 0) {
      filtered = filtered.filter((product) =>
        filterStore.categories.includes(product.category)
      );
    }

    // 2. Fiyat filtresi
    filtered = filtered.filter(
      (product) =>
        product.price >= filterStore.priceRange.min &&
        product.price <= filterStore.priceRange.max
    );

    // 3. Malzeme filtresi
    if (filterStore.materials.length > 0) {
      filtered = filtered.filter((product) =>
        product.material && filterStore.materials.includes(product.material)
      );
    }

    // 4. Renk filtresi
    if (filterStore.colors.length > 0) {
      filtered = filtered.filter((product) =>
        product.variants?.some((variant) =>
          variant.color && filterStore.colors.includes(variant.color)
        )
      );
    }

    // 5. Özel özellik filtreleri
    if (filterStore.isNew) {
      filtered = filtered.filter((product) => product.isNew);
    }
    if (filterStore.isBestSeller) {
      filtered = filtered.filter((product) => product.isBestSeller);
    }
    if (filterStore.inStock) {
      filtered = filtered.filter((product) =>
        product.variants?.some((variant) => variant.stock > 0)
      );
    }

    // 6. Arama filtresi
    if (filterStore.searchQuery) {
      const query = filterStore.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          (product.description && product.description.toLowerCase().includes(query))
      );
    }

    // 7. Sıralama
    switch (filterStore.sortBy) {
      case 'newest':
        filtered.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case 'popular':
        filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name, 'tr'));
        break;
    }

    return filtered;
  }, [products, filterStore]);

  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] bg-cream-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  // Empty state
  if (filteredAndSortedProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-32 h-32 mb-6 rounded-full bg-cream-100 flex items-center justify-center">
          <svg
            className="w-16 h-16 text-gold/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        <h3 className="font-serif text-2xl text-black mb-2">
          Ürün Bulunamadı
        </h3>
        
        <p className="text-black/60 mb-6 max-w-md">
          Aradığınız kriterlere uygun ürün bulunmamaktadır. Lütfen farklı filtreler deneyin.
        </p>
        
        <button
          onClick={filterStore.resetFilters}
          className="px-6 py-3 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors"
        >
          Filtreleri Temizle
        </button>
      </div>
    );
  }

  // Product grid
  return (
    <div>
      {/* Results count */}
      <div className="mb-6 text-sm text-black/60">
        <span className="font-medium text-black">
          {filteredAndSortedProducts.length}
        </span>{' '}
        ürün bulundu
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
