'use client';

import { useWishlist } from '@/lib/wishlist';
import ProductGrid from '@/components/ProductGrid';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-[#0F0F0F] pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 font-cormorant text-4xl font-bold text-white md:text-5xl">
              Favorilerim
            </h1>
            <p className="font-inter text-white/60">
              {items.length} ürün favorilerinizde
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearWishlist}
              className="rounded-lg bg-white/5 px-4 py-2 font-inter text-sm font-medium text-white/70 transition-all hover:bg-white/10 hover:text-white"
            >
              Tümünü Temizle
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
              <Heart className="h-10 w-10 text-white/30" />
            </div>
            <h3 className="mb-2 font-cormorant text-2xl font-semibold text-white">
              Favorileriniz Boş
            </h3>
            <p className="mb-6 font-inter text-white/60">
              Beğendiğiniz ürünleri favorilerinize ekleyin
            </p>
            <Link
              href="/products"
              className="rounded-full bg-gold-gradient px-6 py-3 font-inter font-semibold text-black"
            >
              Ürünlere Göz At
            </Link>
          </div>
        ) : (
          <ProductGrid products={items} />
        )}
      </div>
    </div>
  );
}

