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

  const categoryLabel =
    product.category === 'kolye' ? 'Kolye' :
    product.category === 'kupe' ? 'Küpe' :
    product.category === 'bilezik' ? 'Bileklik' : 'Yüzük';

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

  return (
    <Link href={`/products/${product.slug}`} className="block group">
      <motion.div
        className="relative overflow-hidden rounded-2xl cursor-pointer"
        style={{ height: '340px', backgroundColor: 'rgba(15,15,15,0.9)' }}
        whileHover="hovered"
        initial="initial"
      >
        {/* Velzck-style spotlight: clip-path circle expands on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-0"
          style={{ background: accent }}
          variants={{
            initial: { clipPath: 'circle(35% at 80% 5%)' },
            hovered: { clipPath: 'circle(70% at 80% -25%)' },
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        {/* NOVELLA watermark — scales on hover like Velzck */}
        <motion.div
          aria-hidden
          className="absolute select-none pointer-events-none leading-none z-[1]"
          style={{
            top: '45%',
            left: '-15%',
            fontSize: '11rem',
            fontWeight: 800,
            fontStyle: 'italic',
            whiteSpace: 'nowrap',
            color: '#242424',
          }}
          variants={{
            initial: { scale: 1, color: '#242424' },
            hovered: { scale: 2, y: 24, color: '#505050' },
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          NOVELLA
        </motion.div>

        {/* Product image — rotates and lifts on hover */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10"
          variants={{
            initial: { scale: 1, rotate: -5, y: 0 },
            hovered: { scale: 1.1, rotate: -12, y: -18 },
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

        {/* Description panel slides up from bottom on hover */}
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
              {product.price} ₺
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                {product.originalPrice} ₺
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="w-full py-2.5 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            style={{ background: accent, color: '#111' }}
          >
            <ShoppingBag className="w-4 h-4" />
            Satın Al
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
          <span className="text-sm font-semibold text-[#C9A86A]">{product.price} ₺</span>
          {hasDiscount && (
            <span className="text-xs text-[#9B9B9B] line-through">{product.originalPrice} ₺</span>
          )}
        </div>
      </div>
    </Link>
  );
}
