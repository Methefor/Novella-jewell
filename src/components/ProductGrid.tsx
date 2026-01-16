'use client';

import { useCart } from '@/lib/cart';
import { NovellaProduct } from '@/lib/sanity.types';
import { formatPrice } from '@/lib/sanity.utils';
import { useWishlist } from '@/lib/wishlist';
import { motion } from 'framer-motion';
import { Eye, Heart, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

interface ProductGridProps {
  products: NovellaProduct[];
}

export default function ProductGrid({ products }: ProductGridProps) {

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
          <ShoppingCart className="h-10 w-10 text-white/30" />
        </div>
        <h3 className="mb-2 font-cormorant text-2xl font-semibold text-white">
          Henüz Ürün Yok
        </h3>
        <p className="mb-6 font-inter text-white/60">
          Sanity CMS'den ürünler yükleniyor veya henüz ürün eklenmemiş.
        </p>
        <Link
          href="/"
          className="rounded-full bg-gold-gradient px-6 py-3 font-inter font-semibold text-black"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}

const ProductCard = memo(function ProductCard({
  product,
  index,
}: {
  product: NovellaProduct;
  index: number;
}) {
  const { addItem, toggleCart } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '',
      category: product.category,
    });
    toggleCart();
  };

  const mainImage = product.images?.[0] || '/placeholder-product.jpg';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      {/* Badge */}
      {product.isBestSeller && (
        <div className="absolute left-4 top-4 z-10">
          <span className="rounded-full bg-rose-gold px-3 py-1 font-inter text-xs font-semibold text-white shadow-lg">
            Çok Satan
          </span>
        </div>
      )}
      {product.isNew && (
        <div className="absolute left-4 top-4 z-10">
          <span className="rounded-full bg-gold px-3 py-1 font-inter text-xs font-semibold text-black shadow-lg">
            Yeni
          </span>
        </div>
      )}

      {/* Card */}
      <div className="glass overflow-hidden rounded-2xl transition-all duration-300 hover:bg-white/10 hover-glow">
        {/* Image */}
        <Link href={`/products/${product.slug}`}>
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gold/10 to-rose-gold/10">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Hover Actions */}
            <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/60 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
              <Link href={`/products/${product.slug}`}>
                <motion.button
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className="glass flex h-12 w-12 items-center justify-center rounded-full text-white transition-all hover:bg-white/20"
                >
                  <Eye className="h-5 w-5" />
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-black shadow-lg transition-all hover:bg-gold-light hover:shadow-gold/50"
              >
                <ShoppingCart className="h-5 w-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleItem(product)}
                className={`glass flex h-12 w-12 items-center justify-center rounded-full transition-all hover:bg-white/20 ${
                  inWishlist ? 'text-rose-gold bg-rose-gold/20' : 'text-white'
                }`}
              >
                <Heart className={`h-5 w-5 ${inWishlist ? 'fill-current' : ''}`} />
              </motion.button>
            </div>
          </div>
        </Link>

        {/* Info */}
        <div className="p-4 md:p-6">
          {/* Category */}
          <span className="mb-1 inline-block font-inter text-[10px] font-medium uppercase tracking-wider text-white/60 md:mb-2 md:text-xs">
            {product.category}
          </span>

          {/* Name */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="mb-2 font-cormorant text-lg font-semibold text-white transition-colors hover:text-gold md:text-xl">
              {product.name}
            </h3>
          </Link>

          {/* Price & Action */}
          <div className="flex items-center justify-between">
            <div className="font-inter text-xl font-bold text-gold md:text-2xl">
              {formatPrice(product.price)}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="rounded-full bg-gold/20 px-4 py-1.5 font-inter text-xs font-semibold text-gold transition-all hover:bg-gold hover:text-black md:px-6 md:py-2 md:text-sm"
            >
              Sepete Ekle
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

