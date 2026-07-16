'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const ease = [0.16, 1, 0.3, 1] as const;

const featurePills = ['Suya Dayanıklı', 'Alerji Yapmaz', 'Hediye Kutusunda'];

export default function Hero() {
  return (
    <section
      className="relative w-full overflow-hidden bg-[#F8F6F3]"
      style={{ height: 'calc(100dvh - var(--navbar-h, 64px))' }}
    >
      {/* Background pattern — subtle */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "url('/products/Pattern.png')",
          backgroundSize: 'auto',
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Main hero image — woman's hand with bracelet */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease }}
          className="relative w-full h-full"
        >
          <Image
            src="/products/hero-hand-bracelet.jpg"
            alt="Novella bileklik — kadın elinde paslanmaz çelik takı"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </motion.div>
      </div>

      {/* Subtle gradient overlay for readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, rgba(248,246,243,0.85) 0%, rgba(248,246,243,0.4) 50%, rgba(248,246,243,0.85) 100%)',
        }}
      />

      {/* Content — centered layout */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container-custom px-4">
          <div className="max-w-3xl mx-auto text-center">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease }}
              className="flex items-center justify-center gap-2 mb-6"
            >
              <span className="w-[5px] h-[5px] rounded-full bg-gold" />
              <span className="font-sans font-light text-sm text-black/55">
                El seçimi paslanmaz çelik takı
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease }}
              className="font-serif font-light text-black mb-8"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              Kararmayan çelik.
              <br />
              Eskimeyen zarafet.
            </motion.h1>

            {/* Feature pills */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7, ease }}
              className="flex flex-wrap items-center justify-center gap-3 mb-10"
            >
              {featurePills.map((label) => (
                <span
                  key={label}
                  className="px-5 py-2.5 rounded-full font-sans font-light text-sm text-black/60 bg-white/80 border border-black/8 backdrop-blur-sm"
                >
                  {label}
                </span>
              ))}
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9, ease }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                href="/koleksiyonlar"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-black text-white rounded-full hover:bg-gold transition-colors text-sm font-medium tracking-wide"
              >
                Koleksiyonu Keşfet
              </Link>
              <Link
                href="/hakkimizda"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-transparent text-black border border-black/18 rounded-full hover:border-black/55 transition-colors text-sm font-medium"
              >
                Hikayemiz
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative gold accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 1.2, ease }}
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold origin-left"
      />
    </section>
  );
}
