'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const ease = [0.16, 1, 0.3, 1] as const;

const featurePills = ['Suya Dayanıklı', 'Alerji Yapmaz', 'Hediye Kutusunda'];

export default function Hero() {
  return (
    <section
      className="relative w-full overflow-hidden bg-white"
      style={{ height: 'calc(100dvh - var(--navbar-h, 64px))' }}
    >
      {/* Background image — Ken Burns (video placeholder) */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease }}
        className="absolute inset-0"
      >
        <Image
          src="/products/herobackground.png"
          alt="Novella koleksiyonu — paslanmaz çelik takı"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>

      {/* White gradient fade */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, #fff 0%, rgba(255,255,255,0.72) 42%, transparent 100%)',
        }}
      />

      {/* Content — anchored to bottom */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="container-custom pb-10 md:pb-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            {/* Left block */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease }}
              className="max-w-[520px]"
            >
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6, ease }}
                className="flex items-center gap-2 mb-5"
              >
                <span
                  className="w-[5px] h-[5px] rounded-full flex-shrink-0"
                  style={{ backgroundColor: 'rgba(10,10,10,0.45)' }}
                />
                <span
                  className="font-sans font-light"
                  style={{
                    fontSize: '13px',
                    color: 'rgba(10,10,10,0.55)',
                    lineHeight: 1,
                  }}
                >
                  El seçimi paslanmaz çelik takı
                </span>
              </motion.div>

              {/* H1 */}
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8, ease }}
                className="font-serif font-light text-black mb-7 text-balance"
                style={{
                  fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
                  lineHeight: 1.05,
                  letterSpacing: '-0.03em',
                }}
              >
                Kararmayan çelik.
                <br />
                Eskimeyen zarafet.
              </motion.h1>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0, ease }}
                className="flex flex-wrap items-center gap-3"
              >
                <Link href="/collections" className="btn-primary">
                  Koleksiyonu Keşfet
                </Link>
                <Link href="/hikayemiz" className="btn-ghost">
                  Hikayemiz
                </Link>
              </motion.div>
            </motion.div>

            {/* Right block — feature pills, desktop only */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0, ease }}
              className="hidden md:flex flex-col gap-2 items-end"
            >
              {featurePills.map((label) => (
                <span
                  key={label}
                  className="px-4 py-2 rounded-full font-sans font-light"
                  style={{
                    fontSize: '12px',
                    color: 'rgba(10,10,10,0.55)',
                    backgroundColor: 'rgba(255,255,255,0.75)',
                    border: '1px solid rgba(10,10,10,0.08)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {label}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
