'use client';

import { NovellaProduct } from '@/lib/sanity.types';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, Heart, ShoppingBag, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ProductCardProps {
  product: NovellaProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const addItemToCart = useCartStore((state) => state.addItem);
  const addItemToWishlist = useWishlistStore((state) => state.addItem);
  const removeItemFromWishlist = useWishlistStore((state) => state.removeItem);
  const isInWishlist = useWishlistStore((state) =>
    state.isInWishlist(product.id)
  );

  const variants = product.variants || [];
  const currentImage = product.images?.[currentImageIndex] || product.images?.[0] || '/placeholder-product.jpg';

  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.originalPrice! - product.price) / product.originalPrice!) *
          100
      )
    : 0;

  const handleAddToCart = () => {
    if (variants.length > 0) {
      addItemToCart(product, variants[0].id, 1);
    } else {
      // Fallback if no variants, though schema requires them
       addItemToCart(product, 'default', 1);
    }
  };

  const handleToggleWishlist = () => {
    if (isInWishlist) {
      removeItemFromWishlist(product.id);
    } else {
      addItemToWishlist(product);
    }
  };

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-500 hover:shadow-lg hover:-translate-y-2">
        <Link
          href={`/products/${product.slug}`}
          className="relative block aspect-square overflow-hidden bg-cream"
        >
          <Image
            src={currentImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {hasDiscount ? (
              <span className="badge badge-sale text-xs">
                %{discountPercentage} İNDİRİM
              </span>
            ) : product.isNew ? (
              <span className="badge badge-new text-xs">YENİ</span>
            ) : product.isBestSeller ? (
              <span className="badge badge-bestseller text-xs">ÇOK SATAN</span>
            ) : null}
          </div>

          <div
            className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
              isHovered
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-4'
            }`}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                handleToggleWishlist();
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all ${
                isInWishlist
                  ? 'bg-red-500 text-white'
                  : 'bg-white/90 text-gray-600 hover:bg-gold hover:text-white'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`}
              />
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                setIsQuickViewOpen(true);
              }}
              className="w-10 h-10 rounded-full bg-white/90 text-gray-600 hover:bg-gold hover:text-white flex items-center justify-center backdrop-blur-sm transition-all"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </Link>

        <div className="p-4 space-y-3">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">
            {product.category}
          </p>

          <Link href={`/products/${product.slug}`}>
            <h3 className="font-serif text-lg leading-snug text-gray-900 hover:text-gold transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {product.rating && product.reviewCount && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating!)
                        ? 'text-gold fill-gold'
                        : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400">
                ({product.reviewCount})
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {product.price.toLocaleString('tr-TR')}₺
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                {product.originalPrice!.toLocaleString('tr-TR')}₺
              </span>
            )}
          </div>

          {variants.length > 1 && (
            <div className="flex items-center gap-2 pt-2">
              {variants.slice(0, 4).map((variant, index) => (
                <button
                  key={variant.id}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    currentImageIndex === index
                      ? 'border-gold scale-110'
                      : 'border-gray-200 hover:border-gold'
                  }`}
                  style={{
                    backgroundColor:
                      variant.color === 'altin' || variant.color === 'gold'
                        ? '#C9A86A'
                        : variant.color === 'gumus' || variant.color === 'silver'
                        ? '#C0C0C0'
                        : variant.color === 'rose-gold'
                        ? '#B76E79'
                        : variant.color === 'siyah' || variant.color === 'black'
                        ? '#2D2D2D'
                        : variant.color === 'beyaz' || variant.color === 'white'
                        ? '#F8F6F3'
                        : '#C9A86A',
                  }}
                />
              ))}
              {variants.length > 4 && (
                <span className="text-xs text-gray-400">
                  +{variants.length - 4}
                </span>
              )}
            </div>
          )}

          <button
            onClick={handleAddToCart}
            className="w-full py-3 bg-transparent border-2 border-gray-200 text-gray-900 font-medium rounded-lg hover:border-gold hover:bg-gold hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Sepete Ekle</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isQuickViewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsQuickViewOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid md:grid-cols-2 gap-8 p-8">
                <div className="relative aspect-square bg-cream rounded-xl overflow-hidden">
                  <Image
                    src={currentImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                </div>

                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-widest text-gray-400">
                    {product.category}
                  </p>
                  <h2 className="font-serif text-3xl text-gray-900">
                    {product.name}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>

                  {product.rating && product.reviewCount && (
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating!)
                                ? 'text-gold fill-gold'
                                : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-400">
                        {product.rating.toFixed(1)} ({product.reviewCount}{' '}
                        değerlendirme)
                      </span>
                    </div>
                  )}

                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-gray-900">
                      {product.price.toLocaleString('tr-TR')}₺
                    </span>
                    {hasDiscount && (
                      <span className="text-lg text-gray-400 line-through">
                        {product.originalPrice!.toLocaleString('tr-TR')}₺
                      </span>
                    )}
                  </div>

                  {product.features && product.features.length > 0 && (
                    <ul className="space-y-2 pt-4">
                      {product.features.slice(0, 3).map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-gray-600"
                        >
                          <svg
                            className="w-5 h-5 text-gold flex-shrink-0 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 py-3 bg-gold text-white font-medium rounded-lg hover:bg-gold-dark transition-all"
                    >
                      Sepete Ekle
                    </button>
                    <Link
                      href={`/products/${product.slug}`}
                      className="flex-1 py-3 border-2 border-gray-200 text-gray-900 font-medium rounded-lg hover:border-gold hover:text-gold transition-all text-center"
                    >
                      Detayları Gör
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
