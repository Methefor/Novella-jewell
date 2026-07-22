'use client';

import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';

/**
 * Sepet store'unun localStorage'dan yüklenmesinin (rehydrate) tamamlanıp
 * tamamlanmadığını bildirir.
 *
 * Store skipHydration:true ile kuruludur ve StoreHydration mount sonrası
 * rehydrate eder. Bu tamamlanmadan `items` her zaman boş görünür; sepete
 * bakarak karar veren sayfalar (ör. /odeme'nin boş sepette /sepet'e
 * yönlendirmesi) bu hook true dönene kadar beklemelidir.
 */
export function useCartHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (useCartStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    return useCartStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  return hydrated;
}
