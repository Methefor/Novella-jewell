'use client'

import { X } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="relative bg-gradient-to-r from-gold via-gold-light to-gold text-white">
      <div className="container-custom">
        <div className="flex items-center justify-between h-10 text-sm font-medium">
          {/* Scrolling Text - Mobile */}
          <div className="flex-1 overflow-hidden md:hidden">
            <div className="animate-scroll whitespace-nowrap">
              <span className="inline-block px-4">
                ✨ Açılış Kampanyası | İlk 50 Siparişte %20 İndirim
              </span>
              <span className="inline-block px-4">
                🎁 Ücretsiz Kargo & İsim Baskısı
              </span>
              <span className="inline-block px-4">
                💎 Her Parça Bir Hikaye
              </span>
            </div>
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
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Bildirimi kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </div>
  )
}
