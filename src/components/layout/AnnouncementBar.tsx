'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

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
              {/* Scrolling Text - Mobile */}
              <div className="flex-1 overflow-hidden md:hidden">
                <motion.div
                  animate={{ x: ['0%', '-50%'] }}
                  transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
                  className="flex whitespace-nowrap"
                >
                  {[...Array(2)].map((_, i) => (
                    <span key={i} className="inline-flex items-center gap-6 px-4">
                      <span>✨ Açılış Kampanyası | İlk 50 Siparişte %20 İndirim</span>
                      <span className="text-white/40">·</span>
                      <span>🎁 Ücretsiz Kargo & İsim Baskısı</span>
                      <span className="text-white/40">·</span>
                      <span>💎 Her Parça Bir Hikaye</span>
                      <span className="text-white/40">·</span>
                    </span>
                  ))}
                </motion.div>
              </div>

              {/* Static Text - Desktop */}
              <div className="hidden md:flex items-center justify-center flex-1 gap-6">
                <Link
                  href="/collections/yeni"
                  className="hover:underline transition-all"
                >
                  ✨ Açılış Kampanyası | İlk 50 Siparişte %20 İndirim
                </Link>
                <span className="text-white/60">|</span>
                <span>🎁 Ücretsiz Kargo & İsim Baskısı</span>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsVisible(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
                aria-label="Bildirimi kapat"
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
