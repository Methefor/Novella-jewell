/**
 * NOVELLA - Hero Section
 * Ana sayfa hero bölümü
 */

'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/products/herobackground.png"
          alt="NOVELLA Background"
          fill
          priority
          quality={100}
          className="object-cover"
        />
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
      </div>

      {/* Background Pattern (Optional) */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(212,175,55,0.15),transparent_50%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/20 border border-gold/40 text-gold backdrop-blur-sm mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Premium Çelik Takılar</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6 drop-shadow-2xl"
          >
            <span className="text-white">Her Parça </span>
            <span className="text-gradient-gold">Bir Hikaye</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-lg"
          >
            Sizin için özenle seçilmiş butik takı koleksiyonları. Kaliteli çelik
            takılar, premium tasarımlar, uygun fiyatlar.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/collections"
              className="
                group
                px-8 py-4 
                bg-gold text-black 
                rounded-lg font-medium text-lg
                hover:bg-gold-light hover:shadow-gold-lg
                transition-all duration-300
                flex items-center gap-2
                min-w-[200px] justify-center
              "
            >
              Koleksiyonu Keşfet
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/collections/yeni"
              className="
                px-8 py-4 
                border-2 border-gold text-gold
                rounded-lg font-medium text-lg
                hover:bg-gold hover:text-black
                backdrop-blur-sm bg-black/20
                transition-all duration-300
                min-w-[200px] text-center
              "
            >
              Yeni Gelenler
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto"
          >
            <div className="text-center backdrop-blur-sm bg-black/20 p-4 rounded-lg">
              <div className="text-3xl md:text-4xl font-bold text-gold mb-2 drop-shadow-lg">
                200+
              </div>
              <div className="text-sm text-white/80">Ürün Çeşidi</div>
            </div>
            <div className="text-center backdrop-blur-sm bg-black/20 p-4 rounded-lg border-x border-white/10">
              <div className="text-3xl md:text-4xl font-bold text-gold mb-2 drop-shadow-lg">
                %100
              </div>
              <div className="text-sm text-white/80">Müşteri Memnuniyeti</div>
            </div>
            <div className="text-center backdrop-blur-sm bg-black/20 p-4 rounded-lg">
              <div className="text-3xl md:text-4xl font-bold text-gold mb-2 drop-shadow-lg">
                7/24
              </div>
              <div className="text-sm text-white/80">Destek</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 border-2 border-gold/40 rounded-full flex items-start justify-center p-2 backdrop-blur-sm"
        >
          <div className="w-1 h-2 bg-gold rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
