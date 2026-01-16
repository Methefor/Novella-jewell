'use client';

import Link from 'next/link';

interface CheckoutSuccessClientProps {
  orderId?: string;
  method?: string;
}

export default function CheckoutSuccessClient({
  orderId,
  method,
}: CheckoutSuccessClientProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
      <Link
        href="/products"
        className="rounded-full bg-gold-gradient px-8 py-4 font-inter font-semibold text-black transition-all hover:shadow-lg hover:shadow-gold/30"
      >
        Alışverişe Devam Et
      </Link>
      <Link
        href="/"
        className="glass rounded-full px-8 py-4 font-inter font-semibold text-white transition-all hover:bg-white/10"
      >
        Ana Sayfaya Dön
      </Link>
      {method === 'whatsapp' && (
        <a
          href="https://wa.me/905451125059"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-green-500 px-8 py-4 font-inter font-semibold text-white transition-all hover:bg-green-600"
        >
          WhatsApp'ta Aç
        </a>
      )}
    </div>
  );
}

