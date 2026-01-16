'use client';

import { useState, useMemo } from 'react';
import { Product } from '@/lib/sanity.types';
import ProductGrid from './ProductGrid';
import ProductFilters, { FilterOptions } from './ProductFilters';

interface ProductsClientProps {
  initialProducts: Product[];
  categories: string[];
}

export default function ProductsClient({
  initialProducts,
  categories,
}: ProductsClientProps) {
  const [filters, setFilters] = useState<FilterOptions>({});

  const filteredProducts = useMemo(() => {
    let filtered = [...initialProducts];

    // Category filter
    if (filters.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    // Price range filter
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
    }

    // Badge filters
    if (filters.featured) {
      filtered = filtered.filter((p) => p.featured);
    }
    if (filters.bestseller) {
      filtered = filtered.filter((p) => p.bestseller);
    }
    if (filters.new) {
      filtered = filtered.filter((p) => p.new);
    }

    // Sort
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'name-asc':
          filtered.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
          break;
        case 'newest':
          // Assuming products have createdAt or similar
          filtered.reverse();
          break;
        case 'oldest':
          // Keep original order
          break;
      }
    }

    return filtered;
  }, [initialProducts, filters]);

  return (
    <>
      <ProductFilters
        filters={filters}
        onFiltersChange={setFilters}
        categories={categories}
      />
      <ProductGrid products={filteredProducts} />
    </>
  );
}

