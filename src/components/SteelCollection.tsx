'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Eye, Heart, ShoppingCart } from 'lucide-react';
import { useRef } from 'react';
import { useCart } from '@/lib/cart';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

const steelProducts: Product[] = [
  {
    id: 1,
    name: 'Minimal Çelik Kolye',
    price: 299,
    image: '/products/steel-necklace-1.jpg',
    category: 'Kolye',
  },
  {
    id: 2,
    name: 'Geometrik Çelik Bilezik',
    price: 249,
    image: '/products/steel-bracelet-1.jpg',
    category: 'Bilezik',
  },
  {
    id: 3,
    name: 'Sade Çelik Küpe',
    price: 199,
    image: '/products/steel-earring-1.jpg',
    category: 'Küpe',
  },
  {
    id: 4,
    name: 'Modern Çelik Yüzük',
    price: 179,
    image: '/products/steel-ring-1.jpg',
    category: 'Yüzük',
  },
  {
    id: 5,
    name: 'Katmanlı Çelik Kolye',
    price: 349,
    image: '/products/steel-necklace-2.jpg',
    category: 'Kolye',
  },
  {
    id: 6,
    name: 'İnce Çelik Halka',
    price: 159,
    image: '/products/steel-ring-2.jpg',
    category: 'Yüzük',
  },
];

function ProductCard({ product }: { product: Product }) {
  const { addItem, toggleCart } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    toggleCart();
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="group relative h-[380px] w-[260px] flex-shrink-0 overflow-hidden rounded-2xl md:h-[450px] md:w-[320px]"
    >
      {/* Glass Background */}
      <div className="glass-strong absolute inset-0 transition-all duration-300 group-hover:bg-white/15" />

      {/* Product Image */}
      <div className="relative h-[65%] w-full overflow-hidden bg-gradient-to-br from-white/5 to-white/0">
        {/* Placeholder - gerçek fotoğraflar yüklenince değişecek */}
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gold/10 to-rose-gold/10">
          <span className="font-cormorant text-5xl text-white/20 md:text-6xl">
            {product.category[0]}
          </span>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/60 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="glass flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-gold hover:text-black md:h-12 md:w-12"
          >
            <Eye className="h-4 w-4 md:h-5 md:w-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="glass flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-gold hover:text-black md:h-12 md:w-12"
          >
            <Heart className="h-4 w-4 md:h-5 md:w-5" />
          </motion.button>
        </div>

        {/* Category Badge */}
        <div className="absolute right-3 top-3 md:right-4 md:top-4">
          <span className="glass rounded-full px-2 py-1 font-inter text-[10px] font-medium text-white/80 md:px-3 md:text-xs">
            {product.category}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="relative flex h-[35%] flex-col justify-between p-4 md:p-6">
        <div>
          <h3 className="mb-1 font-cormorant text-xl font-semibold text-white md:mb-2 md:text-2xl">
            {product.name}
          </h3>
          <p className="font-inter text-xs text-white/60 md:text-sm">
            Paslanmaz Çelik
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="font-inter text-xl font-bold text-gold md:text-2xl">
            ₺{product.price}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-inter font-semibold text-black transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/30"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Sepete Ekle</span>
          </motion.button>
        </div>
      </div>

      {/* Glow Effect */}
      <div className="pointer-events-none absolute -bottom-10 left-1/2 h-20 w-3/4 -translate-x-1/2 rounded-full bg-gold/20 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </motion.div>
  );
}

export default function SteelCollection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.8, 1, 1, 0.8]
  );

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-[#0F0F0F] py-20"
    >
      {/* Background Elements */}
      <div className="absolute left-0 top-1/4 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-0 h-96 w-96 rounded-full bg-rose-gold/5 blur-3xl" />

      <motion.div style={{ opacity, scale }} className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-4 inline-block rounded-full border border-gold/30 bg-gold/10 px-4 py-2 font-inter text-sm font-medium text-gold">
              ÇELİK KOLEKSİYON
            </span>

            <h2 className="mb-4 font-cormorant text-5xl font-bold text-white md:text-6xl">
              Paslanmaz Zarafet
            </h2>

            <p className="mx-auto max-w-2xl font-inter text-lg text-white/60">
              Günlük kullanıma uygun, paslanmaz çelik takılarımızla stilinizi
              tamamlayın. Dayanıklı ve şık tasarımlar.
            </p>
          </motion.div>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="relative">
          {/* Scroll Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-6 flex items-center justify-center gap-2 font-inter text-sm text-white/40"
          >
            <span>Kaydırarak keşfedin</span>
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              →
            </motion.div>
          </motion.div>

          {/* Products */}
          <div className="scrollbar-hide flex gap-6 overflow-x-auto pb-8">
            {steelProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          {/* Gradient Fade Edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#0F0F0F] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#0F0F0F] to-transparent" />
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass inline-flex items-center gap-2 rounded-full px-8 py-4 font-inter font-semibold text-white transition-all hover:bg-white/10"
          >
            Tüm Çelik Ürünleri Gör
            <span>→</span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
