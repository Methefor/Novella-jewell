'use client';

import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import type { Product } from '@/types/product';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

const accentColors: Record<string, string> = {
  kolye: '#C9A86A',
  kupe: '#D4B77F',
  bilezik: '#B8975A',
  yuzuk: '#E0C882',
};

export default function ProductCard({ product }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const addToCart = useCartStore((state) => state.addItem);
  const addToWishlist = useWishlistStore((state) => state.addItem);
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);
  const isInWishlist = useWishlistStore((state) =>
    state.isInWishlist(product.id)
  );

  const defaultVariant =
    product.variants.find((v) => v.id === product.defaultVariant) ||
    product.variants[0];
  const currentImage = defaultVariant.images[0];

  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.originalPrice! - product.price) / product.originalPrice!) * 100
      )
    : 0;

  const accent = accentColors[product.category] || '#C9A86A';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, product.defaultVariant, 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const categoryLabel =
    product.category === 'kolye' ? 'Kolye' :
    product.category === 'kupe' ? 'Kupe' :
    product.category === 'bilezik' ? 'Bileklik' : 'Yuzuk';

  return (
    <Link href={`/products/${product.slug}`} className="block group">
      <motion.div
        className="relative overflow-hidden rounded-2xl bg-[#111111] cursor-pointer"
        style={{ height: '340px' }}
        whileHover="hovered"
        initial="initial"
      >
        {/* Gold circle spotlight top-right */}
        <motion.div
          className="absolute -top-6 -right-6 w-36 h-36 rounded-full pointer-events-none"
          style={{ background: accent, clipPath: 'circle(50%)' }}
          variants={{
            initial: { opacity: 0.15, scale: 1 },
            hovered: { opacity: 0.28, scale: 1.2 },
          }}
          transition={{ duration: 0.4 }}
        />

        {/* NOVELLA watermark */}
        <div
          aria-hidden
          className="absolute top-1/2 -left-2 -translate-y-1/2 select-none pointer-events-none leading-none"
          style={{
            color: '#1C1C1C',
            fontSize: '5.5rem',
            fontWeight: 900,
            fontStyle: 'italic',
            whiteSpace: 'nowrap',
            zIndex: 1,
          }}
        >
          NOVELLA
        </div>

        {/* Product image */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10"
          variants={{
            initial: { scale: 1, rotate: -5, y: 0 },
            hovered: { scale: 1.1, rotate: -10, y: -14 },
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        >
          <motion.div
            className="relative w-44 h-44"
            animate={{ opacity: imageLoaded ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <Image
              src={currentImage}
              alt={product.name}
              fill
              className="object-contain drop-shadow-2xl"
              sizes="176px"
              onLoad={() => setImageLoaded(true)}
            />
          </motion.div>
        </motion.div>

        {/* Hover overlay slides up from bottom */}
        <motion.div
          className="absolute inset-x-0 bottom-0 z-20 px-5 py-4"
          style={{
            background: 'rgba(0,0,0,0.92)',
            borderTop: `2px solid ${accent}`,
          }}
          variants={{
            initial: { y: '100%' },
            hovered: { y: 0 },
          }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        >
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: accent }}>
            {categoryLabel}
          </p>
          <h3 className="font-serif text-white text-sm font-semibold mb-3 leading-tight">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base font-bold" style={{ color: accent }}>
              {product.price}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                {product.originalPrice}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="w-full py-2.5 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            style={{ background: accent, color: '#111' }}
          >
            <ShoppingBag className="w-4 h-4" />
            Sepete Ekle
          </button>
        </motion.div>

        {/* Wishlist button */}
        <motion.button
          onClick={handleToggleWishlist}
          className="absolute top-3 left-3 z-30 w-9 h-9 rounded-full flex items-center justify-center bg-black/60 backdrop-blur-sm border border-white/10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart
            className="w-4 h-4"
            fill={isInWishlist ? accent : 'none'}
            style={{ color: isInWishlist ? accent : '#fff' }}
          />
        </motion.button>

        {/* Discount badge */}
        {hasDiscount && (
          <div
            className="absolute top-3 right-3 z-30 px-2 py-1 rounded-md text-xs font-bold"
            style={{ background: accent, color: '#111' }}
          >
            %{discountPercentage}
          </div>
        )}
      </motion.div>

      {/* Name & price below card */}
      <div className="mt-3 px-1">
        <h3 className="font-medium text-[#1A1A1A] text-sm leading-tight group-hover:text-[#C9A86A] transition-colors duration-200">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold text-[#C9A86A]">{product.price}</span>
          {hasDiscount && (
            <span className="text-xs text-[#9B9B9B] line-through">{product.originalPrice}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
