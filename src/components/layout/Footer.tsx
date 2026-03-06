'use client';

import { Instagram, MessageCircle } from 'lucide-react';
import Link from 'next/link';

const faqs = [
  'Kargo ne kadar sürer?',
  'Siparişimi nasıl takip ederim?',
  'Ürün iade koşulları nelerdir?',
  'Hangi ödeme yöntemlerini kullanabilirim?',
  'Sipariş iptal edebilir miyim?',
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-[#111111] text-white">
      {/* Top gold bar */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#C9A86A] to-transparent" />
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C9A86A]/30 to-transparent mt-0.5" />

      <div className="container-custom py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand + Address */}
        <div className="space-y-6">
          <Link href="/" className="inline-block">
            <span
              className="font-serif text-3xl font-bold"
              style={{
                background: 'linear-gradient(-75deg, #111 0%, #111 5%, rgba(255,255,255,0.5) 5%, rgba(255,255,255,0.5) 10%, #111 10%, #111 100%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'reflection 8s ease-in-out infinite',
                color: '#C9A86A',
              }}
            >
              NOVELLA
            </span>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed">
            Her parça bir hikaye.
            <br />
            Zarafet ve kalitede sınır tanımayan butik takı koleksiyonu.
          </p>
          <div className="space-y-2 text-sm text-gray-400">
            <p className="font-semibold text-[#C9A86A] uppercase tracking-wider text-xs">
              İletişim
            </p>
            <p>WhatsApp: +90 545 112 50 59</p>
            <p>Instagram: @jewelry.novella</p>
            <a
              href="https://www.shopier.com/novellatr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[#C9A86A] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM5.17 5H21l-1.68 8.39c-.16.8-.9 1.39-1.72 1.39H8.1c-.82 0-1.56-.59-1.73-1.39L4.25 3H2V1H5l.17 4z"/>
              </svg>
              Shopier: novellatr
            </a>
          </div>
        </div>

        {/* FAQ */}
        <div id="faq" className="space-y-4">
          <h2 className="font-serif text-xl text-white mb-6">
            Sık Sorulan Sorular
          </h2>
          <ul className="space-y-3">
            {faqs.map((q) => (
              <li key={q} className="flex items-start gap-2 text-sm text-gray-400 hover:text-[#C9A86A] transition-colors cursor-default">
                <span className="text-[#C9A86A] mt-0.5 flex-shrink-0">›</span>
                {q}
              </li>
            ))}
          </ul>
        </div>

        {/* Social + Nav */}
        <div className="space-y-6">
          <h2 className="font-serif text-xl text-white">Bizi Takip Edin</h2>
          <div className="flex gap-3">
            <a
              href="https://api.whatsapp.com/send?phone=905451125059"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:border-[#C9A86A] hover:text-[#C9A86A] transition-all"
              title="WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/jewelry.novella/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:border-[#C9A86A] hover:text-[#C9A86A] transition-all"
              title="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.shopier.com/novellatr"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:border-[#C9A86A] hover:text-[#C9A86A] transition-all"
              title="Shopier"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM5.17 5H21l-1.68 8.39c-.16.8-.9 1.39-1.72 1.39H8.1c-.82 0-1.56-.59-1.73-1.39L4.25 3H2V1H5l.17 4z"/>
              </svg>
            </a>
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-[#C9A86A] uppercase tracking-wider text-xs">
              Sayfalar
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/collections" className="hover:text-[#C9A86A] transition-colors">
                  Koleksiyonlar
                </Link>
              </li>
              <li>
                <Link href="/favoriler" className="hover:text-[#C9A86A] transition-colors">
                  Favorilerim
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-[#C9A86A] transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-[#C9A86A] transition-colors">
                  SSS
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <span>© {year} NOVELLA. Tüm hakları saklıdır.</span>
          <span>Türkiye</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes reflection {
          20%, 100% { background-position: -120% 0; }
        }
      `}</style>
    </footer>
  );
}
