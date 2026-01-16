'use client';

import { useCart } from '@/lib/cart';
import { useWishlist } from '@/lib/wishlist';
import { motion } from 'framer-motion';
import { Eye, Heart, ShoppingCart, Star } from 'lucide-react';

const featuredProducts = [
  {
    id: 7,
    name: 'Zarif Altın Kolye',
    slug: 'zarif-altin-kolye',
    price: 449,
    image: '/products/gold-necklace.jpg',
    category: 'Kolye',
    rating: 4.8,
    reviews: 124,
    badge: 'Çok Satan',
  },
  {
    id: 8,
    name: 'İnci Detaylı Küpe',
    slug: 'inci-detayli-kupe',
    price: 329,
    image: '/products/pearl-earring.jpg',
    category: 'Küpe',
    rating: 4.9,
    reviews: 89,
    badge: 'Yeni',
  },
  {
    id: 9,
    name: 'Minmalist Rose Gold Yüzük',
    slug: 'minimalist-rosegold-yuzuk',
    price: 279,
    image: '/products/rosegold-ring.jpg',
    category: 'Yüzük',
    rating: 4.7,
    reviews: 156,
  },
  {
    id: 10,
    name: 'Zincir Detaylı Bilezik',
    slug: 'zincir-detayli-bilezik',
    price: 359,
    image: '/products/chain-bracelet.jpg',
    category: 'Bilezik',
    rating: 4.6,
    reviews: 92,
  },
  {
    id: 11,
    name: 'Geometrik Altın Kolye',
    slug: 'geometrik-altin-kolye',
    price: 499,
    image: '/products/geometric-necklace.jpg',
    category: 'Kolye',
    rating: 4.9,
    reviews: 203,
    badge: 'Çok Satan',
  },
  {
    id: 12,
    name: 'Kristal Taşlı Küpe',
    slug: 'kristal-tasli-kupe',
    price: 389,
    image: '/products/crystal-earring.jpg',
    category: 'Küpe',
    rating: 4.8,
    reviews: 134,
  },
];

function ProductCard({
  product,
  index,
}: {
  product: (typeof featuredProducts)[0];
  index: number;
}) {
  const { addItem, toggleCart } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id.toString());

  const handleAddToCart = () => {
    addItem({
      id: product.id.toString(), // Convert to string
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    toggleCart();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute left-4 top-4 z-10">
          <span className="rounded-full bg-rose-gold px-3 py-1 font-inter text-xs font-semibold text-white shadow-lg">
            {product.badge}
          </span>
        </div>
      )}

      {/* Card */}
      <div className="glass overflow-hidden rounded-2xl transition-all duration-300 hover:bg-white/10 hover-glow">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gold/10 to-rose-gold/10">
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-cormorant text-8xl text-white/10">
              {product.category[0]}
            </span>
          </div>

          {/* Hover Actions */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/60 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
            <motion.button
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.9 }}
              className="glass flex h-12 w-12 items-center justify-center rounded-full text-white transition-all hover:bg-white/20"
            >
              <Eye className="h-5 w-5" />
            </motion.button>

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
              onClick={() =>
                toggleItem({
                  id: product.id.toString(),
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  category: product.category,
                  images: [product.image],
                })
              }
              className={`glass flex h-12 w-12 items-center justify-center rounded-full transition-all hover:bg-white/20 ${
                inWishlist ? 'text-rose-gold bg-rose-gold/20' : 'text-white'
              }`}
            >
              <Heart className={`h-5 w-5 ${inWishlist ? 'fill-current' : ''}`} />
            </motion.button>
          </div>

          {/* Favorite Button (always visible on mobile) */}
          <button
            onClick={() =>
              toggleItem({
                id: product.id.toString(),
                name: product.name,
                slug: product.slug,
                price: product.price,
                category: product.category,
                images: [product.image],
              })
            }
            className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm transition-all hover:bg-black/50 lg:opacity-0 lg:group-hover:opacity-100 ${
              inWishlist ? 'text-rose-gold' : 'text-white'
            }`}
          >
            <Heart className={`h-5 w-5 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Info */}
        <div className="p-4 md:p-6">
          {/* Category */}
          <span className="mb-1 inline-block font-inter text-[10px] font-medium uppercase tracking-wider text-white/60 md:mb-2 md:text-xs">
            {product.category}
          </span>

          {/* Name */}
          <h3 className="mb-2 font-cormorant text-lg font-semibold text-white md:text-xl">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="mb-3 flex items-center gap-2 md:mb-4">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-gold text-gold md:h-4 md:w-4" />
              <span className="font-inter text-xs font-semibold text-white md:text-sm">
                {product.rating}
              </span>
            </div>
            <span className="font-inter text-[10px] text-white/40 md:text-xs">
              ({product.reviews} değerlendirme)
            </span>
          </div>

          {/* Price & Action */}
          <div className="flex items-center justify-between">
            <div className="font-inter text-xl font-bold text-gold md:text-2xl">
              ₺{product.price}
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
}

export default function FeaturedProducts() {
  return (
    <section className="relative overflow-hidden bg-[#0F0F0F] py-20">
      {/* Background Elements */}
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-rose-gold/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-rose-gold/30 bg-rose-gold/10 px-4 py-2 font-inter text-sm font-medium text-rose-gold">
            ÖNE ÇIKANLAR
          </span>

          <h2 className="mb-4 font-cormorant text-5xl font-bold text-white md:text-6xl">
            En Sevilen Tasarımlar
          </h2>

          <p className="mx-auto max-w-2xl font-inter text-lg text-white/60">
            Müşterilerimizin favorisi, kalitesi ve estetiği ile öne çıkan
            ürünlerimiz. Sınırlı stok!
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-full bg-gold-gradient px-10 py-4 font-inter font-semibold text-black shadow-lg transition-all hover:shadow-xl hover:shadow-gold/30"
          >
            Tüm Koleksiyonu Keşfet
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
