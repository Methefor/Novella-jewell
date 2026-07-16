'use client';

import {
  COOKIE_CONSENT_EVENT,
  getConsent,
  setConsent,
  type ConsentValue,
} from '@/lib/cookies';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * KVKK çerez onay banner'ı.
 * Analitik çerezler yalnızca "Kabul et" seçilirse çalışır (bkz. GoogleAnalytics).
 *
 * Mobil öncelikli: dar ekranda butonlar tam genişlik ve alt alta,
 * dokunma hedefleri 44px+.
 */
export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // İlk yüklemede tercih yoksa göster.
    setVisible(getConsent() === null);

    // Çerez politikası sayfasındaki "tercihimi değiştir" butonu
    // tercihi sıfırlayınca banner tekrar açılsın.
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<ConsentValue>).detail;
      setVisible(detail === null);
    };

    window.addEventListener(COOKIE_CONSENT_EVENT, onChange);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onChange);
  }, []);

  const choose = (value: 'accepted' | 'rejected') => {
    setConsent(value);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.45, ease }}
          className="fixed bottom-0 left-0 right-0 z-[60] p-3 sm:p-5"
          role="dialog"
          aria-live="polite"
          aria-label="Çerez tercihi"
        >
          <div className="mx-auto max-w-3xl rounded-2xl border border-gold/30 bg-white/95 backdrop-blur-md shadow-lg p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <p className="font-sans font-light text-[13px] leading-relaxed text-black/70 flex-1">
                Sepetin çalışması için zorunlu çerezler kullanıyoruz. Ziyaret
                istatistiklerini görmemizi sağlayan analitik çerezler ise
                yalnızca izin verirsen çalışır.{' '}
                <Link
                  href="/cerez-politikasi"
                  className="text-black underline underline-offset-2 hover:text-gold-dark whitespace-nowrap"
                >
                  Ayrıntılar
                </Link>
              </p>

              <div className="flex gap-2.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => choose('rejected')}
                  className="flex-1 sm:flex-none min-h-[44px] px-5 rounded-full border border-black/20 text-[13px] font-medium text-black/70 hover:border-black/45 hover:text-black transition-colors"
                >
                  Sadece zorunlu
                </button>
                <button
                  type="button"
                  onClick={() => choose('accepted')}
                  className="flex-1 sm:flex-none min-h-[44px] px-5 rounded-full bg-black text-white text-[13px] font-medium hover:bg-gold transition-colors"
                >
                  Kabul et
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
