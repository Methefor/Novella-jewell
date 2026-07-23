'use client';

import { useCartHydrated } from '@/hooks/useCartHydrated';
import { useCartStore } from '@/store/cartStore';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/** Son ziyaret damgası — bu süreden eskiyse sepet "terk edilmiş" sayılır. */
const ESKIME_SURESI_MS = 6 * 60 * 60 * 1000; // 6 saat
const DAMGA_ANAHTARI = 'novella-son-ziyaret';

/**
 * Terk edilmiş sepet hatırlatıcısı — sepetinde ürün bırakıp saatler sonra
 * geri dönen ziyaretçiye zarif bir hatırlatma gösterir. E-posta altyapısı
 * gerektirmeyen, tamamen istemci taraflı kurtarma adımı.
 */
export default function SepetHatirlatici() {
  const hydrated = useCartHydrated();
  const { items, subtotal } = useCartStore();
  const pathname = usePathname();
  const [goster, setGoster] = useState(false);

  useEffect(() => {
    if (!hydrated) return;

    const simdi = Date.now();
    const onceki = Number(localStorage.getItem(DAMGA_ANAHTARI) ?? 0);
    localStorage.setItem(DAMGA_ANAHTARI, String(simdi));

    // Sepet/ödeme sayfalarında hatırlatmaya gerek yok — zaten oradalar.
    const sepetYolunda = pathname === '/sepet' || pathname === '/odeme';
    if (
      !sepetYolunda &&
      items.length > 0 &&
      onceki > 0 &&
      simdi - onceki > ESKIME_SURESI_MS
    ) {
      setGoster(true);
    }
    // Yalnızca dönüş anında bir kez karar verilir — items değişimleri
    // banner'ı yeniden tetiklememeli.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  return (
    <AnimatePresence>
      {goster && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-md"
          role="status"
        >
          <div className="flex items-center gap-4 rounded-2xl bg-black text-white shadow-2xl px-5 py-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="w-5 h-5 text-gold" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">
                Sepetiniz sizi bekliyor
              </p>
              <p className="text-xs text-white/60 truncate">
                {items.length} ürün • {subtotal.toLocaleString('tr-TR')} ₺
              </p>
            </div>
            <Link
              href="/sepet"
              onClick={() => setGoster(false)}
              className="text-xs font-medium bg-white text-black rounded-full px-4 py-2 hover:bg-gold hover:text-white transition-colors flex-shrink-0"
            >
              Sepete Git
            </Link>
            <button
              type="button"
              onClick={() => setGoster(false)}
              aria-label="Hatırlatmayı kapat"
              className="text-white/40 hover:text-white transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
