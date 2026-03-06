'use client';

import ProductCard from '@/components/product/ProductCard';
import AboutUs from '@/components/sections/AboutUs';
import GsapCarousel from '@/components/sections/GsapCarousel';
import { getAllProducts } from '@/data/products';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

const scrollingWords = [
  'zarafet.',
  'özgünlük.',
  'kalite.',
  'lüks.',
  'zarafet.',
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as number[] },
  },
};

export default function HomePage() {
  const products = getAllProducts();
  const newProducts = products.filter((p) => p.isNew).slice(0, 8);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 8);

  return (
    <main className="min-h-screen bg-[#0D0D0D]">
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#0D0D0D]">
        {/* Atmospheric gold radial glows */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 70% 50%, rgba(201,168,106,0.08) 0%, transparent 60%),' +
              'radial-gradient(ellipse at 20% 80%, rgba(201,168,106,0.05) 0%, transparent 50%)',
          }}
        />
        {/* Subtle noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
            backgroundRepeat: 'repeat',
            backgroundSize: '128px',
          }}
        />

        <div className="container-custom relative z-10 py-24 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C9A86A]/30 bg-[#C9A86A]/5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C9A86A]" />
              <span className="text-xs font-medium text-[#C9A86A] uppercase tracking-wider">
                Yeni Koleksiyon
              </span>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-gray-400 text-xl mb-3 font-light">
                Takıyla hisset
              </h2>
              <div className="overflow-hidden h-16 md:h-20">
                <motion.div
                  animate={{ y: ['0%', '-400%'] }}
                  transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                  className="flex flex-col"
                >
                  {scrollingWords.map((word, i) => (
                    <h1
                      key={i}
                      className="font-serif text-5xl md:text-6xl h-16 md:h-20 flex items-center"
                      style={{ color: i % 2 === 0 ? '#C9A86A' : '#D4B77F' }}
                    >
                      {word}
                    </h1>
                  ))}
                </motion.div>
              </div>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-gray-400 text-lg leading-relaxed max-w-xl"
            >
              Zarafet ve kalitede sınır tanımayan butik takı koleksiyonumuzu
              keşfedin. Her tasarım, kendine özgü hikayesiyle sizinle buluşuyor.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/collections"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm group"
                style={{ background: '#C9A86A', color: '#111' }}
              >
                Koleksiyonu Keşfet
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm border border-white/20 text-white hover:border-[#C9A86A] hover:text-[#C9A86A] transition-all"
              >
                Ürünleri Gör
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10"
            >
              {[
                { value: '200+', label: 'Ürün Çeşidi' },
                { value: '5.000+', label: 'Mutlu Müşteri' },
                { value: '4.8', label: 'Ort. Puan' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-[#C9A86A]">{value}</p>
                  <p className="text-xs text-gray-500 mt-1">{label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — GSAP Carousel */}
          <motion.div
            className="hidden lg:block relative h-[500px]"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <GsapCarousel />
          </motion.div>
        </div>

        {/* Subtle fade to products section (dark) */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0D0D0D] to-transparent" />
      </section>

      {/* PRODUCTS — Dark background like Velzck */}
      <section id="products" className="py-20 bg-[#0D0D0D]">
        {/* Gold separator line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C9A86A]/30 to-transparent mb-20" />

        <div className="container-custom">
          {/* New Arrivals */}
          {newProducts.length > 0 && (
            <div className="mb-24">
              <motion.div
                className="mb-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-xs uppercase tracking-widest text-[#C9A86A] font-medium mb-2">
                  Yeni Gelenler
                </p>
                <h2 className="font-serif text-4xl text-white">
                  En Yeni Koleksiyon
                </h2>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
              >
                {newProducts.map((product) => (
                  <motion.div key={product.id} variants={itemVariants}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>

              <div className="text-center mt-10">
                <Link
                  href="/collections/yeni-gelenler"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-[#C9A86A] text-[#C9A86A] rounded-lg text-sm font-medium hover:bg-[#C9A86A] hover:text-[#111] transition-all"
                >
                  Tümünü Gör <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Gold divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C9A86A]/20 to-transparent mb-24" />

          {/* Best Sellers */}
          {bestSellers.length > 0 && (
            <div>
              <motion.div
                className="mb-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-xs uppercase tracking-widest text-[#C9A86A] font-medium mb-2">
                  Çok Satanlar
                </p>
                <h2 className="font-serif text-4xl text-white">
                  En Beğenilenler
                </h2>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
              >
                {bestSellers.map((product) => (
                  <motion.div key={product.id} variants={itemVariants}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>

              <div className="text-center mt-10">
                <Link
                  href="/collections"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm"
                  style={{ background: '#C9A86A', color: '#111' }}
                >
                  Tüm Ürünleri Gör <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ABOUT US */}
      <AboutUs />
    </main>
  );
}
