/**
 * NOVELLA - Filter Store (Zustand)
 * Ürün filtreleme ve sıralama state management
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { 
  FilterState, 
  ProductCategory, 
  ProductMaterial, 
  ProductColor,
  SortOption 
} from '@/types/product';

interface FilterStore extends FilterState {
  // Actions
  setCategories: (categories: ProductCategory[]) => void;
  toggleCategory: (category: ProductCategory) => void;
  
  setPriceRange: (min: number, max: number) => void;
  
  setMaterials: (materials: ProductMaterial[]) => void;
  toggleMaterial: (material: ProductMaterial) => void;
  
  setColors: (colors: ProductColor[]) => void;
  toggleColor: (color: ProductColor) => void;
  
  setIsNew: (value: boolean) => void;
  setIsBestSeller: (value: boolean) => void;
  setIsCustomizable: (value: boolean) => void;
  setInStock: (value: boolean) => void;
  
  setSortBy: (sortBy: SortOption) => void;
  setSearchQuery: (query: string) => void;
  
  // Reset actions
  resetFilters: () => void;
  resetAllExceptCategory: () => void;
}

const initialState: FilterState = {
  categories: [],
  priceRange: {
    min: 0,
    max: 1000,
  },
  materials: [],
  colors: [],
  isNew: false,
  isBestSeller: false,
  isCustomizable: false,
  inStock: false,
  sortBy: 'newest',
  searchQuery: '',
};

export const useFilterStore = create<FilterStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        // Kategori actions
        setCategories: (categories) => 
          set({ categories }, false, 'setCategories'),
        
        toggleCategory: (category) =>
          set((state) => {
            const exists = state.categories.includes(category);
            return {
              categories: exists
                ? state.categories.filter((c) => c !== category)
                : [...state.categories, category],
            };
          }, false, 'toggleCategory'),

        // Fiyat actions
        setPriceRange: (min, max) =>
          set({ priceRange: { min, max } }, false, 'setPriceRange'),

        // Malzeme actions
        setMaterials: (materials) =>
          set({ materials }, false, 'setMaterials'),
        
        toggleMaterial: (material) =>
          set((state) => {
            const exists = state.materials.includes(material);
            return {
              materials: exists
                ? state.materials.filter((m) => m !== material)
                : [...state.materials, material],
            };
          }, false, 'toggleMaterial'),

        // Renk actions
        setColors: (colors) =>
          set({ colors }, false, 'setColors'),
        
        toggleColor: (color) =>
          set((state) => {
            const exists = state.colors.includes(color);
            return {
              colors: exists
                ? state.colors.filter((c) => c !== color)
                : [...state.colors, color],
            };
          }, false, 'toggleColor'),

        // Boolean filters
        setIsNew: (value) => set({ isNew: value }, false, 'setIsNew'),
        setIsBestSeller: (value) => set({ isBestSeller: value }, false, 'setIsBestSeller'),
        setIsCustomizable: (value) => set({ isCustomizable: value }, false, 'setIsCustomizable'),
        setInStock: (value) => set({ inStock: value }, false, 'setInStock'),

        // Sort & search
        setSortBy: (sortBy) => set({ sortBy }, false, 'setSortBy'),
        setSearchQuery: (query) => set({ searchQuery: query }, false, 'setSearchQuery'),

        // Reset actions
        resetFilters: () => set(initialState, false, 'resetFilters'),
        
        resetAllExceptCategory: () =>
          set((state) => ({
            ...initialState,
            categories: state.categories,
          }), false, 'resetAllExceptCategory'),
      }),
      {
        name: 'novella-filters',
        partialize: (state) => ({
          // Persist sadece önemli filtreleri
          categories: state.categories,
          sortBy: state.sortBy,
        }),
      }
    )
  )
);

// Selectors (performance optimization)
export const selectActiveFiltersCount = (state: FilterStore) => {
  let count = 0;
  
  if (state.categories.length > 0) count += state.categories.length;
  if (state.materials.length > 0) count += state.materials.length;
  if (state.colors.length > 0) count += state.colors.length;
  if (state.priceRange.min !== 0 || state.priceRange.max !== 1000) count++;
  if (state.isNew) count++;
  if (state.isBestSeller) count++;
  if (state.isCustomizable) count++;
  if (state.inStock) count++;
  
  return count;
};

export const selectHasActiveFilters = (state: FilterStore) => {
  return selectActiveFiltersCount(state) > 0;
};
