'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

const ease = [0.16, 1, 0.3, 1] as const;

interface LightboxProps {
  gallery: string[];
  index: number;
  urunAdi: string;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}

/**
 * Tam ekran görsel büyüteci.
 *
 * Takıda taş ve işçilik detayı satın alma kararının merkezinde; müşteri
 * yakından bakamazsa güvenmez. Bu bileşen tıklamayla açılır ve iki büyütme
 * kademesi sunar:
 *   - Açılışta: görsel ekrana sığar (fit).
 *   - Tıkla/dokun: 2.5x yakınlaşır, imleç/parmak konumuna odaklanır.
 *
 * Masaüstünde fareyle gezdirince yakınlaştırılmış nokta imleci takip eder
 * (büyüteç hissi). Mobilde dokunulan nokta merkez alınır.
 */
export default function Lightbox({
  gallery,
  index,
  urunAdi,
  onClose,
  onIndexChange,
}: LightboxProps) {
  const reduceMotion = useReducedMotion();
  const [zoomlu, setZoomlu] = useState(false);
  // Yakınlaşma odağı — yüzde cinsinden (transform-origin).
  const [odak, setOdak] = useState({ x: 50, y: 50 });

  const kapat = useCallback(() => {
    setZoomlu(false);
    onClose();
  }, [onClose]);

  const gec = useCallback(
    (yon: 1 | -1) => {
      setZoomlu(false);
      onIndexChange((index + yon + gallery.length) % gallery.length);
    },
    [index, gallery.length, onIndexChange]
  );

  // Klavye: Esc kapatır, oklar gezer.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') kapat();
      else if (e.key === 'ArrowLeft') gec(-1);
      else if (e.key === 'ArrowRight') gec(1);
    };
    window.addEventListener('keydown', onKey);
    // Lightbox açıkken arka planın kaymasını engelle.
    const oncekiOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = oncekiOverflow;
    };
  }, [kapat, gec]);

  const tikla = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setOdak({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
    setZoomlu((z) => !z);
  };

  const fareHareket = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomlu) return;
    const r = e.currentTarget.getBoundingClientRect();
    setOdak({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease }}
      className="fixed inset-0 z-[100] bg-black/92 backdrop-blur-sm flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={`${urunAdi} — büyütülmüş görsel`}
    >
      {/* Kapat */}
      <button
        type="button"
        onClick={kapat}
        aria-label="Kapat"
        className="absolute top-4 right-4 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Sayaç */}
      {gallery.length > 1 && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 font-sans text-[13px] tracking-widest text-white/70">
          {index + 1} / {gallery.length}
        </div>
      )}

      {/* Görsel alanı */}
      <div
        className="relative w-full h-full flex items-center justify-center p-6 sm:p-12"
        onClick={(e) => {
          // Boşluğa tıklayınca kapat; görsele tıklayınca zoom (aşağıda durdurulur).
          if (e.target === e.currentTarget) kapat();
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease }}
            className={`relative max-w-[92vw] max-h-[84vh] ${
              zoomlu ? 'cursor-zoom-out' : 'cursor-zoom-in'
            }`}
            style={{ aspectRatio: '1/1', width: 'min(84vh, 92vw)' }}
            onClick={tikla}
            onMouseMove={fareHareket}
          >
            <div className="absolute inset-0 overflow-hidden rounded-lg">
              <Image
                src={gallery[index]}
                alt={`${urunAdi} — ${index + 1}. görsel`}
                fill
                className="object-cover transition-transform duration-300 ease-out select-none"
                style={{
                  transform: zoomlu ? 'scale(2.5)' : 'scale(1)',
                  transformOrigin: `${odak.x}% ${odak.y}%`,
                }}
                sizes="92vw"
                priority
                draggable={false}
              />
            </div>

            {/* Büyüteç ipucu — sadece zoomsuzken */}
            {!zoomlu && (
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 text-white/90 text-[12px] font-sans pointer-events-none">
                <ZoomIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Yakınlaştır</span>
                <span className="sm:hidden">Dokun</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sol/sağ oklar — masaüstü */}
      {gallery.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => gec(-1)}
            aria-label="Önceki görsel"
            className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl transition-colors"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => gec(1)}
            aria-label="Sonraki görsel"
            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl transition-colors"
          >
            ›
          </button>

          {/* Küçük noktalar */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {gallery.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setZoomlu(false);
                  onIndexChange(i);
                }}
                aria-label={`${i + 1}. görsele git`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === i ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}
