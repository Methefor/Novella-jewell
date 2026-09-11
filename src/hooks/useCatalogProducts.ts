'use client';

import type { Product } from '@/types/product';
import { useEffect } from 'react';
import { create } from 'zustand';

interface CatalogState {
  products: Product[];
  status: 'idle' | 'loading' | 'ready' | 'error';
  load: () => Promise<void>;
}

// All client recommendations and search share one request, including empty catalogs.
const useCatalog = create<CatalogState>((set, get) => ({
  products: [],
  status: 'idle',
  async load() {
    if (get().status === 'loading') return;
    set({ status: 'loading' });
    try {
      const response = await fetch('/api/katalog', { cache: 'no-store' });
      if (!response.ok) throw new Error('Catalog unavailable');
      const products: Product[] = await response.json();
      set({ products: products.map((p) => ({ ...p, createdAt: new Date(p.createdAt), updatedAt: new Date(p.updatedAt) })), status: 'ready' });
    } catch {
      set({ products: [], status: 'error' });
    }
  },
}));

export function useCatalogProducts() {
  const state = useCatalog();
  const load = state.load;
  useEffect(() => {
    if (useCatalog.getState().status === 'idle') void load();
  }, [load]);
  return state;
}
