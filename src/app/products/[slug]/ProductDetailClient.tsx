/**
 * NOVELLA - Product Detail Client Component
 * Luxury Cream Theme + Review System
 */

'use client';

import ReviewForm from '@/components/product/ReviewForm';
import ReviewList from '@/components/product/ReviewList';
import ReviewStats from '@/components/product/ReviewStats';
import { calculateReviewStats, getReviewsByProductId } from '@/data/reviews';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import type { Product } from '@/types/product';
import { Heart, Minus, Plus, Share2, ShoppingBag, Star } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.defaultVariant
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const addToCart = useCartStore((state) => state.addItem);
  const addToWishlist = useWishlistStore((state) => state.addItem);
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);
  const isInWishlist = useWishlistStore((state) =>
    state.isInWishlist(product.id)
  );

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) ||
    product.variants[0];

  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.originalPrice! - product.price) / product.originalPrice!) *
          100
      )
    : 0;

  const isInStock = selectedVariant.stock > 0;

  // Review data
  const productReviews = getReviewsByProductId(product.id);
  const reviewStats = calculateReviewStats(productReviews);

  const handleAddToCart = () => {
    if (isInStock) {
      addToCart(product, selectedVariantId, quantity);
    }
  };

  const handleToggleWishlist = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-800 rounded-2xl overflow-hidden border border-white/10">
              <Image
                src={selectedVariant.images[selectedImageIndex]}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {/* Badges - Icon + Küçük */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {hasDiscount ? (
                  <span className="badge badge-sale">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    %{discountPercentage} İNDİRİM
                  </span>
                ) : product.isNew ? (
                  <span className="badge badge-new">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    YENİ
                  </span>
                ) : product.isBestSeller ? (
                  <span className="badge badge-bestseller">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    ÇOK SATAN
                  </span>
                ) : null}

                {!isInStock && (
                  <span className="badge badge-out-of-stock">STOKTA YOK</span>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3">
              {selectedVariant.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`
                    relative aspect-square rounded-lg overflow-hidden border-2 transition-all
                    ${
                      selectedImageIndex === index
                        ? 'border-gold shadow-lg shadow-gold/30'
                        : 'border-white/10 hover:border-gold/50'
                    }
                  `}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 25vw, 12.5vw"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            <p className="text-sm uppercase tracking-wider text-gold font-semibold">
              {product.category}
            </p>

            {/* Title */}
            <h1 className="font-serif text-4xl md:text-5xl text-white leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            {reviewStats.totalReviews > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(reviewStats.averageRating)
                          ? 'text-gold fill-gold'
                          : 'text-white/20'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-white/70">
                  {reviewStats.averageRating.toFixed(1)} (
                  {reviewStats.totalReviews} değerlendirme)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-bold text-gold">
                {product.price.toLocaleString('tr-TR')}₺
              </span>
              {hasDiscount && (
                <span className="text-2xl text-white/30 line-through">
                  {product.originalPrice!.toLocaleString('tr-TR')}₺
                </span>
              )}
            </div>

            {/* Savings */}
            {hasDiscount && (
              <p className="text-emerald-400 font-medium">
                {(product.originalPrice! - product.price).toLocaleString(
                  'tr-TR'
                )}
                ₺ tasarruf ediyorsunuz!
              </p>
            )}

            {/* Description */}
            <p className="text-white/70 text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Color Selection */}
            {product.variants.length > 1 && (
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">
                  Renk: {selectedVariant.color}
                </h3>
                <div className="flex items-center gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`
                        w-10 h-10 rounded-full border-2 transition-all
                        ${
                          selectedVariantId === variant.id
                            ? 'border-gold ring-4 ring-gold/30 scale-110'
                            : 'border-white/20 hover:border-gold/50'
                        }
                      `}
                      style={{
                        backgroundColor:
                          variant.color === 'altin'
                            ? '#D4AF37'
                            : variant.color === 'gumus'
                            ? '#C0C0C0'
                            : variant.color === 'rose-gold'
                            ? '#B76E79'
                            : variant.color === 'siyah'
                            ? '#0F0F0F'
                            : variant.color === 'beyaz'
                            ? '#FFFFFF'
                            : '#D4AF37',
                      }}
                      title={variant.color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Adet</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="p-3 bg-gray-800 border border-white/10 rounded-lg hover:bg-gray-700 hover:border-gold/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="w-5 h-5 text-white" />
                </button>
                <span className="text-2xl font-semibold text-white w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(selectedVariant.stock, quantity + 1))
                  }
                  disabled={quantity >= selectedVariant.stock}
                  className="p-3 bg-gray-800 border border-white/10 rounded-lg hover:bg-gray-700 hover:border-gold/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Stock Status */}
            {isInStock && selectedVariant.stock <= 10 && (
              <p className="text-orange-400 text-sm font-medium">
                ⚠️ Son {selectedVariant.stock} ürün!
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={!isInStock}
                className="flex-1 py-4 bg-gold text-black font-bold text-lg rounded-xl hover:bg-gold-light transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-gold/50"
              >
                <ShoppingBag className="w-6 h-6" />
                {isInStock ? 'Sepete Ekle' : 'Stokta Yok'}
              </button>

              <button
                onClick={handleToggleWishlist}
                className={`
                  p-4 rounded-xl border-2 transition-all
                  ${
                    isInWishlist
                      ? 'bg-red-500 border-red-500 text-white'
                      : 'bg-gray-800 border-white/20 text-white hover:border-gold hover:bg-gray-700'
                  }
                `}
              >
                <Heart
                  className={`w-6 h-6 ${isInWishlist ? 'fill-current' : ''}`}
                />
              </button>

              <button className="p-4 bg-gray-800 border-2 border-white/20 rounded-xl hover:border-gold hover:bg-gray-700 transition-all">
                <Share2 className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="bg-gray-800 border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Ürün Özellikleri
                </h3>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li
                      key={index}
                      className="text-white/70 flex items-start gap-3"
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
              </div>
            )}

            {/* Customization */}
            {product.isCustomizable && (
              <div className="bg-gold/10 border border-gold/30 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-gold flex-shrink-0 mt-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-semibold text-gold mb-2">
                      Kişiselleştirme
                    </h3>
                    <p className="text-white/70">
                      Bu ürüne özel isim veya mesaj yazdırabilirsiniz.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-gold/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gold"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <p className="text-xs text-white/70">Ücretsiz Kargo</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-gold/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gold"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <p className="text-xs text-white/70">Güvenli Ödeme</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-gold/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gold"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <p className="text-xs text-white/70">Kolay İade</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <div className="border-t border-white/10 pt-12">
            <div className="space-y-8">
              {/* Review Stats */}
              <ReviewStats stats={reviewStats} />

              {/* Write Review */}
              <div className="bg-gray-800 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Değerlendirme Yap
                </h3>
                <ReviewForm productId={product.id} />
              </div>

              {/* Review List */}
              <ReviewList reviews={productReviews} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
