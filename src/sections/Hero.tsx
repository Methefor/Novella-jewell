'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Hero görseli.
 *
 * Görselini eklemek için: dosyayı `public/media/` içine koy ve yolunu buraya yaz.
 *   const HERO_IMAGE = '/media/hero.jpg';
 *
 * `null` bırakıldığında hero tamamen CSS ile çizilir (gradyan + altın doku).
 * Bu yüzden görsel yokken bile bölüm eksik değil, kasıtlı görünür.
 *
 * NOT: Görselleri `public/media/` altına koy — `public/products/` DEĞİL.
 * `/products/:slug` bir SEO yönlendirmesi olduğu için o klasördeki dosyalar
 * /urun/... adresine yönlenip 404 olur.
 */
const HERO_IMAGE: string | null = null;

const featurePills = ['Suya Dayanıklı', 'Alerji Yapmaz', 'Hediye Kutusunda'];

export default function Hero() {
  return (
    <section
      className="relative w-full overflow-hidden bg-champagne"
      style={{ height: 'calc(100dvh - var(--navbar-h, 64px))' }}
      aria-label="Ana hero bölümü"
    >
      {/* Altın doku katmanları — saf CSS, asset bağımlılığı yok */}
      <div className="absolute inset-0 texture-gold" aria-hidden="true" />
      <div className="absolute inset-0 texture-lines" aria-hidden="true" />

      {/* Opsiyonel hero fotoğrafı — HERO_IMAGE tanımlanınca devreye girer */}
      {HERO_IMAGE && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease }}
            className="absolute inset-0"
          >
            <Image
              src={HERO_IMAGE}
              alt="Novella — el seçimi paslanmaz çelik takı"
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
          </motion.div>
          {/* Metin okunabilirliği için şampanya tonlu overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(160deg, rgba(250,248,245,0.88) 0%, rgba(242,237,228,0.55) 50%, rgba(227,213,184,0.85) 100%)',
            }}
            aria-hidden="true"
          />
        </>
      )}

      {/* Yumuşak altın ışık — derinlik katar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease }}
        className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[110vw] h-[70vh] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(184,165,116,0.20) 0%, transparent 62%)',
        }}
        aria-hidden="true"
      />

      {/* İçerik */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
              className="flex items-center justify-center gap-3 mb-7"
            >
              <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
              <span className="font-sans font-light text-[11px] tracking-[0.18em] uppercase text-gold-dark">
                El seçimi paslanmaz çelik takı
              </span>
              <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease }}
              className="font-serif font-light text-black mb-7 text-balance"
              style={{
                fontSize: 'clamp(2.4rem, 6vw, 4.5rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
              }}
            >
              Kararmayan çelik.
              <br />
              <span className="italic text-gold-dark">Eskimeyen zarafet.</span>
            </motion.h1>

            {/* Alt metin */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease }}
              className="font-sans font-light text-black/55 max-w-lg mx-auto mb-9 text-balance"
              style={{ fontSize: '15px', lineHeight: 1.7 }}
            >
              316L cerrahi çelikten üretilen, suyla ve zamanla arası iyi takılar.
              Her parça bir şehrin hikayesini taşır.
            </motion.p>

            {/* Özellik pill'leri */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.62, ease }}
              className="flex flex-wrap items-center justify-center gap-2.5 mb-10"
              role="list"
              aria-label="Ürün özellikleri"
            >
              {featurePills.map((label) => (
                <span
                  key={label}
                  className="px-4 py-2 rounded-full font-sans font-light text-[13px] text-black/65 bg-white/55 border border-gold/25 backdrop-blur-sm"
                  role="listitem"
                >
                  {label}
                </span>
              ))}
            </motion.div>

            {/* Butonlar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.75, ease }}
              className="flex flex-wrap items-center justify-center gap-3"
            >
              <Link
                href="/koleksiyonlar"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-black text-white rounded-full hover:bg-gold transition-colors duration-300 text-sm font-medium tracking-wide"
              >
                Koleksiyonu Keşfet
              </Link>
              <Link
                href="/hikayemiz"
                className="inline-flex items-center justify-center px-8 py-3.5 text-black border border-gold/45 rounded-full hover:border-gold hover:bg-white/45 transition-colors duration-300 text-sm font-medium"
              >
                Hikayemiz
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Alt altın çizgi */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 1, ease }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gold origin-left"
        aria-hidden="true"
      />
    </section>
  );
}
