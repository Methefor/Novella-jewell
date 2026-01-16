import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { NovellaProduct } from './sanity.types';

interface WishlistStore {
  items: NovellaProduct[];
  addItem: (product: NovellaProduct) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleItem: (product: NovellaProduct) => void;
  clearWishlist: () => void;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const items = get().items;
        if (!items.find((item) => item.id === product.id)) {
          set({ items: [...items, product] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },

      toggleItem: (product) => {
        const isInWishlistResult = get().isInWishlist(product.id);
        if (isInWishlistResult) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },

      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'novella-wishlist-v2',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
