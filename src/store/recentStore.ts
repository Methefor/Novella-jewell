import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Son görüntülenen ürünler.
 *
 * Yalnızca ürün ID'lerini saklar — tam ürün nesnesini değil. Ürün verisi
 * products.ts'ten okunur; böylece fiyat/stok güncellenirse burada eski kopya
 * kalmaz. Sepet/wishlist ürünü snapshot'lar (sipariş anındaki fiyat önemli),
 * ama "son baktıkların" her zaman güncel veriyi göstermeli.
 */
interface RecentStore {
  ids: string[];
  ekle: (productId: string) => void;
  temizle: () => void;
}

const MAKS = 8;

export const useRecentStore = create<RecentStore>()(
  persist(
    (set) => ({
      ids: [],
      ekle: (productId) =>
        set((state) => ({
          // En öne al, tekrarı çıkar, MAKS ile sınırla.
          ids: [productId, ...state.ids.filter((x) => x !== productId)].slice(
            0,
            MAKS
          ),
        })),
      temizle: () => set({ ids: [] }),
    }),
    {
      name: 'novella-recent',
      skipHydration: true, // diğer store'larla aynı desen
    }
  )
);
