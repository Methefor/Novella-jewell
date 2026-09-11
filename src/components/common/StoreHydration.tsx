'use client';

import { useCartStore } from '@/store/cartStore';
import { useRecentStore } from '@/store/recentStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useEffect } from 'react';
import { useCatalogProducts } from '@/hooks/useCatalogProducts';

/**
 * Persist edilen store'ları client'ta hydrate eder.
 * İkisi de skipHydration:true — SSR'da boş kalıp hydration uyuşmazlığını
 * önler, gerçek localStorage verisi burada, mount'tan sonra yüklenir.
 */
export default function StoreHydration() {
  const { products, status } = useCatalogProducts();
  useEffect(() => {
    useCartStore.persist.rehydrate();
    useWishlistStore.persist.rehydrate();
    useRecentStore.persist.rehydrate();
  }, []);
  useEffect(() => {
    if (status !== 'ready') return;
    useCartStore.getState().refreshCatalog(products);
    const favorites = useWishlistStore.getState().items;
    useWishlistStore.setState({ items: favorites.flatMap((item) => {
      const current = products.find((p) => p.id === item.id);
      return current ? [current] : [];
    }) });
  }, [products, status]);
  return null;
}
