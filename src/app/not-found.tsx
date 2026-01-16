'use client';

import { motion } from 'framer-motion';
import { Home, Search, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F0F0F] px-4">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="mb-4 font-cormorant text-8xl font-bold text-white md:text-9xl">
            404
          </h1>
          <h2 className="mb-4 font-cormorant text-3xl font-semibold text-white md:text-4xl">
            Sayfa Bulunamadı
          </h2>
          <p className="mx-auto max-w-md font-inter text-lg text-white/60">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-4 sm:flex-row sm:justify-center"
        >
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-full bg-gold-gradient px-6 py-3 font-inter font-semibold text-black transition-all hover:shadow-lg hover:shadow-gold/30"
          >
            <Home className="h-5 w-5" />
            Ana Sayfa
          </Link>
          <Link
            href="/products"
            className="flex items-center justify-center gap-2 rounded-full bg-white/10 px-6 py-3 font-inter font-semibold text-white transition-all hover:bg-white/20"
          >
            <ShoppingBag className="h-5 w-5" />
            Ürünler
          </Link>
          <Link
            href="/search"
            className="flex items-center justify-center gap-2 rounded-full bg-white/10 px-6 py-3 font-inter font-semibold text-white transition-all hover:bg-white/20"
          >
            <Search className="h-5 w-5" />
            Arama
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

