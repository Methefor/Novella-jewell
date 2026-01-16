/**
 * NOVELLA - Wishlist Store
 * Favori ürünler state management
 */

import type { Product } from '@/types/product';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearAll: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const exists = get().items.find((item) => item.id === product.id);
        if (!exists) {
          set((state) => ({ items: [...state.items, product] }));
        }
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },

      clearAll: () => set({ items: [] }),
    }),
    {
      name: 'novella-wishlist',
    }
  )
);
