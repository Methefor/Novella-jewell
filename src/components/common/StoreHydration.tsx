'use client';

import { useCartStore } from '@/store/cartStore';
import { useEffect } from 'react';

export default function StoreHydration() {
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);
  return null;
}
