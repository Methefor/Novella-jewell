/**
 * NOVELLA - Favoriler Client Component
 * Favori ürünler sayfası client component
 */

'use client';

import SimpleProductGrid from '@/components/product/SimpleProductGrid';
import { useWishlistStore } from '@/store/wishlistStore';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function FavorilerClient() {
  const items = useWishlistStore((state) => state.items);
  const clearAll = useWishlistStore((state) => state.clearAll);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 rounded-full bg-cream-100 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-gold/40" />
          </div>
          <h1 className="font-serif text-3xl text-black mb-4">
            Favorileriniz Boş
          </h1>
          <p className="text-black/60 mb-6">
            Henüz favori ürününüz yok. Beğendiğiniz ürünleri favorilere
            ekleyerek daha sonra kolayca bulabilirsiniz.
          </p>
          <Link
            href="/collections"
            className="inline-block px-6 py-3 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors font-medium"
          >
            Ürünleri Keşfet
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl lg:text-4xl text-black mb-2">
              Favorilerim
            </h1>
            <p className="text-black/60">{items.length} ürün</p>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearAll}
              className="px-4 py-2 border-2 border-cream-300 rounded-lg hover:border-red-500 hover:text-red-500 transition-colors text-sm font-medium"
            >
              Tümünü Temizle
            </button>
          )}
        </div>

        <SimpleProductGrid products={items} columns={4} />
      </div>
    </div>
  );
}
