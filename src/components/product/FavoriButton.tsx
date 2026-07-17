'use client';

import { useWishlistStore } from '@/store/wishlistStore';
import type { Product } from '@/types/product';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FavoriButtonProps {
  product: Product;
  /** 'card' = kartın köşesindeki yuvarlak; 'detail' = detay sayfası satırı */
  variant?: 'card' | 'detail';
}

/**
 * Favoriye ekle/çıkar butonu.
 *
 * Önemli: wishlist localStorage'da saklanıyor. Sunucuda favori bilgisi yok,
 * bu yüzden ilk render'da HERKES için "favoride değil" çizilir; component
 * mount olduktan sonra gerçek durum okunur. `mounted` guard olmadan SSR
 * (boş) ile client (dolu) arasında hydration uyuşmazlığı olur.
 */
export default function FavoriButton({
  product,
  variant = 'card',
}: FavoriButtonProps) {
  const [mounted, setMounted] = useState(false);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist);
  const addItem = useWishlistStore((s) => s.addItem);
  const removeItem = useWishlistStore((s) => s.removeItem);

  useEffect(() => setMounted(true), []);

  // Mount'tan önce daima "favoride değil" — SSR ile aynı çıktı.
  const favoride = mounted && isInWishlist(product.id);

  const toggle = (e: React.MouseEvent) => {
    // Kart bir <Link> içinde; butona basınca ürüne gitmesin.
    e.preventDefault();
    e.stopPropagation();
    if (favoride) removeItem(product.id);
    else addItem(product);
  };

  const etiket = favoride ? 'Favorilerden çıkar' : 'Favorilere ekle';

  if (variant === 'detail') {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={favoride}
        aria-label={etiket}
        className="btn-ghost w-full flex items-center justify-center gap-2"
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            favoride ? 'fill-gold text-gold' : ''
          }`}
        />
        {favoride ? 'Favorilerde' : 'Favorilere Ekle'}
      </button>
    );
  }

  // Kart köşesi
  return (
    <motion.button
      type="button"
      onClick={toggle}
      aria-pressed={favoride}
      aria-label={etiket}
      whileTap={{ scale: 0.82 }}
      className="absolute top-2 right-2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/75 backdrop-blur-sm hover:bg-white transition-colors"
    >
      <motion.span
        key={favoride ? 'dolu' : 'bos'}
        initial={{ scale: favoride ? 0.6 : 1 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            favoride ? 'fill-gold text-gold' : 'text-black/55'
          }`}
        />
      </motion.span>
    </motion.button>
  );
}
