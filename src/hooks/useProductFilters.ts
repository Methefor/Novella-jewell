import type { Product } from '@/types/product';
import { useMemo, useState } from 'react';

export interface ProductFilters {
  categories?: string[];
  materials?: string[];
  colors?: string[];
  priceRange?: [number, number];
  features?: string[];
  sortBy?: 'price-asc' | 'price-desc' | 'name' | 'newest';
}

export function useProductFilters(products: Product[]) {
  const [filters, setFilters] = useState<ProductFilters>({});

  // Update single filter
  const updateFilter = <K extends keyof ProductFilters>(
    key: K,
    value: ProductFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Update multiple filters at once
  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({});
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      result = result.filter((p) => filters.categories!.includes(p.category));
    }

    // Material filter
    if (filters.materials && filters.materials.length > 0) {
      result = result.filter((p) =>
        filters.materials!.some((m) => p.material.includes(m))
      );
    }

    // Color filter
    if (filters.colors && filters.colors.length > 0) {
      result = result.filter((p) =>
        p.variants.some((v) => filters.colors!.includes(v.color))
      );
    }

    // Price range filter
    if (filters.priceRange) {
      result = result.filter(
        (p) =>
          p.price >= filters.priceRange![0] && p.price <= filters.priceRange![1]
      );
    }

    // Features filter
    if (filters.features && filters.features.length > 0) {
      result = result.filter((p) =>
        filters.features!.every((f) => p.features?.includes(f))
      );
    }

    // Sort
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'name':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'newest':
          result = result.filter((p) => p.isNew);
          break;
      }
    }

    return result;
  }, [products, filters]);

  return {
    filters,
    filteredProducts,
    updateFilter,
    updateFilters,
    resetFilters,
  };
}
