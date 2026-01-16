'use client';

import { motion } from 'framer-motion';
import { Heart, Minus, Plus, ShoppingCart, Star } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/lib/cart';
import { useWishlist } from '@/lib/wishlist';
import { Product } from '@/lib/sanity.types';
import { formatPrice } from '@/lib/sanity.utils';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem, toggleCart } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const images = product.images || [];
  const mainImage = images[selectedImageIndex] || '/placeholder-product.jpg';

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: images[0] || '',
        category: product.category,
      });
    }
    toggleCart();
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(prev + delta, product.stock || 10)));
  };

  return (
    <div className="container mx-auto px-4">
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Left - Images */}
        <div>
          {/* Main Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass-strong relative mb-4 aspect-square overflow-hidden rounded-2xl"
          >
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>

          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto">
              {images.map((image, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`glass relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg transition-all ${
                    selectedImageIndex === index
                      ? 'ring-2 ring-gold'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - Görsel ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Right - Product Info */}
        <div className="flex flex-col justify-center">
          {/* Category & Badges */}
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-full border border-gold/30 bg-gold/10 px-4 py-1 font-inter text-xs font-medium text-gold">
              {product.category}
            </span>
            {product.bestseller && (
              <span className="rounded-full bg-rose-gold px-3 py-1 font-inter text-xs font-semibold text-white">
                Çok Satan
              </span>
            )}
            {product.new && (
              <span className="rounded-full bg-gold px-3 py-1 font-inter text-xs font-semibold text-black">
                Yeni
              </span>
            )}
          </div>

          {/* Name */}
          <h1 className="mb-4 font-cormorant text-4xl font-bold text-white md:text-5xl">
            {product.name}
          </h1>

          {/* Price */}
          <div className="mb-6">
            <span className="font-cormorant text-4xl font-bold text-gold md:text-5xl">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Description */}
          {product.description && (
            <p className="mb-8 font-inter text-lg leading-relaxed text-white/70">
              {product.description}
            </p>
          )}

          {/* Stock Info */}
          {product.stock !== undefined && (
            <div className="mb-6">
              {product.stock > 0 ? (
                <span className="font-inter text-sm text-green-400">
                  ✓ Stokta var ({product.stock} adet)
                </span>
              ) : (
                <span className="font-inter text-sm text-red-400">
                  ✗ Stokta yok
                </span>
              )}
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mb-6 flex items-center gap-4">
            <span className="font-inter text-sm font-medium text-white/80">
              Adet:
            </span>
            <div className="glass flex items-center gap-3 rounded-full px-4 py-2">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-inter text-lg font-semibold text-white">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={product.stock !== undefined && quantity >= product.stock}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={product.stock !== undefined && product.stock === 0}
              className="flex-1 rounded-full bg-gold-gradient py-4 font-inter font-semibold text-black shadow-lg transition-all hover:shadow-xl hover:shadow-gold/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Sepete Ekle</span>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleItem(product)}
              className={`glass flex h-14 w-14 items-center justify-center rounded-full transition-all hover:bg-white/10 ${
                inWishlist ? 'text-rose-gold bg-rose-gold/20' : 'text-white'
              }`}
            >
              <Heart className={`h-6 w-6 ${inWishlist ? 'fill-current' : ''}`} />
            </motion.button>
          </div>

          {/* Features */}
          <div className="glass rounded-2xl p-6">
            <h3 className="mb-4 font-cormorant text-xl font-semibold text-white">
              Özellikler
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 font-inter text-sm text-white/70">
                <span className="text-gold">✓</span>
                <span>Paslanmaz Çelik</span>
              </li>
              <li className="flex items-center gap-3 font-inter text-sm text-white/70">
                <span className="text-gold">✓</span>
                <span>Premium Kalite</span>
              </li>
              <li className="flex items-center gap-3 font-inter text-sm text-white/70">
                <span className="text-gold">✓</span>
                <span>14 Gün İade Garantisi</span>
              </li>
              <li className="flex items-center gap-3 font-inter text-sm text-white/70">
                <span className="text-gold">✓</span>
                <span>Ücretsiz Kargo</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

