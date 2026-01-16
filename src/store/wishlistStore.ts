/**
 * NOVELLA - Wishlist Store (Zustand)
 * Favori ürünler state management
 */

import { NovellaProduct } from '@/lib/sanity.types';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface WishlistStore {
  items: NovellaProduct[];
  addItem: (product: NovellaProduct) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],

        addItem: (product) => {
          const items = get().items;
          const exists = items.some((item) => item.id === product.id);

          if (!exists) {
            set({ items: [...items, product] }, false, 'addItem');
          }
        },

        removeItem: (productId) => {
          set(
            {
              items: get().items.filter((item) => item.id !== productId),
            },
            false,
            'removeItem'
          );
        },

        clearWishlist: () => {
          set({ items: [] }, false, 'clearWishlist');
        },

        isInWishlist: (productId) => {
          return get().items.some((item) => item.id === productId);
        },
      }),
      {
        name: 'novella-wishlist',
      }
    )
  )
);
