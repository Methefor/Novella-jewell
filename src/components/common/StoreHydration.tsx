'use client';

import { useCartStore } from '@/store/cartStore';
import { useRecentStore } from '@/store/recentStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useEffect } from 'react';

/**
 * Persist edilen store'ları client'ta hydrate eder.
 * İkisi de skipHydration:true — SSR'da boş kalıp hydration uyuşmazlığını
 * önler, gerçek localStorage verisi burada, mount'tan sonra yüklenir.
 */
export default function StoreHydration() {
  useEffect(() => {
    useCartStore.persist.rehydrate();
    useWishlistStore.persist.rehydrate();
    useRecentStore.persist.rehydrate();
  }, []);
  return null;
}
