'use client';

import Link from 'next/link';

/** Katalog veritabanı erişilemediğinde gösterilir; ürün silinmiş gibi 404 verilmez. */
export default function CatalogUnavailable({ reset }: { reset: () => void }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="text-center max-w-md" role="alert">
        <p className="section-label mb-4">Kısa bir ara</p>
        <h2 className="font-serif text-2xl text-black mb-3">
          Ürünlerimiz şu anda görüntülenemiyor
        </h2>
        <p className="text-black/60 mb-6 text-sm">
          Geçici bir sorun yaşıyoruz. Lütfen birkaç dakika sonra tekrar deneyin.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-full hover:bg-gold transition-colors text-sm font-medium"
          >
            Tekrar Dene
          </button>
          <Link
            href="/iletisim"
            className="inline-flex items-center justify-center px-6 py-3 bg-transparent text-black border border-black/18 rounded-full hover:border-black/55 transition-colors text-sm font-medium"
          >
            Bize Ulaşın
          </Link>
        </div>
      </div>
    </main>
  );
}
