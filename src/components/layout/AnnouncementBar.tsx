'use client';

import { SHIPPING } from '@/lib/config';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

/**
 * Duyuru şeridi.
 *
 * ⚠️ BURAYA SADECE DOĞRULANABİLİR VAAT YAZ.
 * Buradaki her cümle bir ticari taahhüttür. Arkasında çalışan bir sistem
 * yoksa yanıltıcı ticari uygulama sayılır (TKHK m.61) ve Reklam Kurulu
 * ceza kesebilir.
 *
 * Daha önce burada şunlar vardı ve hepsi kaldırıldı:
 * - "🎁 Ücretsiz Kargo" → koşulsuz yazıyordu; oysa kargo yalnızca
 *   SHIPPING.freeThreshold üzerinde ücretsiz. Müşteri sepette ücret görüyordu.
 * - "İlk 50 Siparişte %20 İndirim" → arkasında kupon/indirim sistemi yok,
 *   sipariş sayacı da yok. Uygulanamayan bir kampanya vaadiydi.
 * - "İsim Baskısı" ücretsiz deniyordu → fiyat farkı tanımlı değil.
 * - Link /collections/yeni'ye gidiyordu → geçerli kategori değil, 404.
 */

const esik = SHIPPING.freeThreshold.toLocaleString('tr-TR');

const MESAJLAR = [
  `${esik} ₺ üzeri kargo ücretsiz`,
  '316L cerrahi çelik · Kararmaz',
  'Hediye kutusunda gönderilir',
];

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 40, opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="relative bg-gradient-to-r from-gold via-gold-light to-gold text-white overflow-hidden"
        >
          <div className="container-custom">
            <div className="flex items-center justify-between h-10 text-sm font-medium">
              {/* Mobil — kayan şerit */}
              <div className="flex-1 overflow-hidden md:hidden">
                <motion.div
                  animate={{ x: ['0%', '-50%'] }}
                  transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
                  className="flex whitespace-nowrap"
                >
                  {[...Array(2)].map((_, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-5 px-3 text-[13px]"
                      aria-hidden={i === 1}
                    >
                      {MESAJLAR.map((m) => (
                        <span key={m} className="inline-flex items-center gap-5">
                          <span>{m}</span>
                          <span className="text-white/40">·</span>
                        </span>
                      ))}
                    </span>
                  ))}
                </motion.div>
              </div>

              {/* Masaüstü — sabit metin */}
              <div className="hidden md:flex items-center justify-center flex-1 gap-5">
                <Link
                  href="/collections/yeni-gelenler"
                  className="hover:underline transition-all"
                >
                  Yeni Gelenler
                </Link>
                <span className="text-white/50" aria-hidden="true">
                  |
                </span>
                <span>{MESAJLAR[0]}</span>
                <span className="text-white/50" aria-hidden="true">
                  |
                </span>
                <span>{MESAJLAR[1]}</span>
              </div>

              <button
                type="button"
                onClick={() => setIsVisible(false)}
                aria-label="Duyuruyu kapat"
                className="flex-shrink-0 p-2 -mr-2 hover:opacity-70 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
