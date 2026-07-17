'use client';

import OneriSeridi from '@/components/product/OneriSeridi';
import SimpleProductGrid from '@/components/product/SimpleProductGrid';
import { useWishlistStore } from '@/store/wishlistStore';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function FavorilerClient() {
  const items = useWishlistStore((state) => state.items);
  const clearAll = useWishlistStore((state) => state.clearAll);

  // Wishlist skipHydration ile geliyor: ilk render'da boş, rehydrate sonrası
  // dolu. mounted guard olmadan hydrate tamamlanana kadar "boş" ekranı yanıp
  // sönerdi. mounted olana dek nötr (yükleniyor) tutuyoruz.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <main className="min-h-[70vh] bg-cream" aria-busy="true" />;
  }

  if (items.length === 0) {
    return (
      <main className="min-h-[70vh] bg-cream px-6 pt-24 pb-20">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-cream-deep flex items-center justify-center mx-auto mb-6">
            <Heart className="w-9 h-9 text-gold/50" />
          </div>
          <h1 className="font-serif font-light text-3xl text-black mb-3">
            Favorileriniz boş
          </h1>
          <p className="text-black/55 mb-7 leading-relaxed">
            Beğendiğiniz ürünlerin kalbine dokunun; burada birikip sizi
            bekler.
          </p>
          <Link href="/koleksiyonlar" className="btn-primary">
            Koleksiyonu Keşfet
          </Link>
        </div>

        <OneriSeridi baslik="Yeni Gelenler" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream">
      <div className="container-custom py-16 md:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="section-label mb-2">Favorilerim</p>
            <h1
              className="font-serif font-light text-black"
              style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                letterSpacing: '-0.02em',
              }}
            >
              {items.length} ürün beğendiniz
            </h1>
          </div>

          <button
            type="button"
            onClick={clearAll}
            className="text-sm text-black/45 hover:text-red-600 transition-colors"
          >
            Tümünü temizle
          </button>
        </div>

        <SimpleProductGrid products={items} columns={4} />
      </div>
    </main>
  );
}
