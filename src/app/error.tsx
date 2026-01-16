'use client';

import { useEffect } from 'react';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F0F0F] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong mx-auto max-w-md rounded-2xl p-8 text-center"
      >
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
        </div>
        <h2 className="mb-2 font-cormorant text-2xl font-semibold text-white">
          Bir Hata Oluştu
        </h2>
        <p className="mb-6 font-inter text-white/60">
          {error.message || 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.'}
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 rounded-full bg-gold-gradient px-6 py-3 font-inter font-semibold text-black"
          >
            <RefreshCw className="h-4 w-4" />
            Tekrar Dene
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-full bg-white/10 px-6 py-3 font-inter font-semibold text-white transition-all hover:bg-white/20"
          >
            <Home className="h-4 w-4" />
            Ana Sayfaya Dön
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

