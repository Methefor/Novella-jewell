'use client';

import ProductCard from '@/components/product/ProductCard';
import Hero from '@/sections/Hero';
import { getAllProducts } from '@/data/products';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease },
  }),
};

export default function HomeClient() {
  const products = getAllProducts();

  const newArrivals = [
    ...products.filter((p) => p.category === 'bilezik').slice(0, 3),
    ...products.filter((p) => p.category === 'kupe').slice(0, 2),
    ...products.filter((p) => p.category === 'yuzuk').slice(0, 1),
  ];

  const allBilezik = products.filter((p) => p.category === 'bilezik');
  const allYuzuk = products.filter((p) => p.category === 'yuzuk');
  const allKupe = products.filter((p) => p.category === 'kupe');

  const bestSellers = [
    allKupe.find((p) => p.id === 'kupe-11'),
    allYuzuk[0],
    allBilezik[3],
    allBilezik[4],
    allYuzuk[1],
    allKupe.find((p) => p.id === 'kupe-2'),
  ].filter(Boolean) as typeof products;

  return (
    <main>
      {/* Hero */}
      <Hero />

      {/* New Arrivals */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            custom={0}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 md:mb-14"
          >
            <div>
              <p className="section-label mb-3">Yeni Gelenler</p>
              <h2
                className="font-serif font-light text-black"
                style={{
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.025em',
                }}
              >
                En Yeni Koleksiyon
              </h2>
            </div>
            <Link
              href="/collections/yeni-gelenler"
              className="inline-flex items-center gap-2 text-sm font-sans font-medium text-black/50 hover:text-black transition-colors duration-200 group flex-shrink-0"
            >
              Tümünü Gör
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newArrivals.map((product, i) => (
              <motion.div
                key={product.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeUp}
                custom={i * 0.07}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container-custom">
        <hr className="divider" />
      </div>

      {/* Best Sellers */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            custom={0}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 md:mb-14"
          >
            <div>
              <p className="section-label mb-3">Çok Satanlar</p>
              <h2
                className="font-serif font-light text-black"
                style={{
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.025em',
                }}
              >
                En Beğenilenler
              </h2>
            </div>
            <Link
              href="/koleksiyonlar"
              className="inline-flex items-center gap-2 text-sm font-sans font-medium text-black/50 hover:text-black transition-colors duration-200 group flex-shrink-0"
            >
              Tüm Koleksiyon
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestSellers.map((product, i) => (
              <motion.div
                key={product.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeUp}
                custom={i * 0.07}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hikayemiz — marka anlatısı, /hikayemiz sayfasına köprü */}
      <section className="relative overflow-hidden bg-champagne border-y border-gold/25">
        <div className="absolute inset-0 texture-gold" aria-hidden="true" />
        <div className="absolute inset-0 texture-lines" aria-hidden="true" />

        <div className="container-custom relative py-20 md:py-28">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            custom={0}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
              <p className="font-sans text-[11px] tracking-[0.18em] uppercase text-gold-dark">
                Hikayemiz
              </p>
              <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
            </div>

            <h2
              className="font-serif font-light text-black text-balance mb-6"
              style={{
                fontSize: 'clamp(1.9rem, 3.8vw, 3rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
              }}
            >
              Novella, <span className="italic text-gold-dark">kısa hikaye</span>{' '}
              demek.
            </h2>

            <p
              className="font-sans font-light text-black/60 mb-9 text-balance"
              style={{ fontSize: '16px', lineHeight: 1.8 }}
            >
              Hepimizin çekmecesinde kararmış, yeşil iz bırakmış takılarla dolu
              bir kutu var. Novella o kutuya bir cevap olarak doğdu: sorun
              tasarımda değil, malzemedeydi. Bu yüzden işe 316L cerrahi çelikten
              başladık.
            </p>

            <Link
              href="/hikayemiz"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-black border border-gold/45 rounded-full hover:border-gold hover:bg-white/45 transition-colors duration-300 text-sm font-medium group"
            >
              Hikayemizi Okuyun
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Values strip */}
      <section className="py-10 bg-cream-deep border-y border-border">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              {
                title: '316L Paslanmaz Çelik',
                body: 'Kararmaz, solmaz, suya dayanıklı.',
              },
              {
                title: 'Hediye Paketleme',
                body: 'Her sipariş özel kutusunda gelir.',
              },
              {
                title: '14 Gün Cayma Hakkı',
                // "Koşulsuz" denemez: kişiye özel üretim ve ambalajı açılmış
                // küpelerde yasal istisna var (Yönetmelik m.15). Bkz. /iade
                body: 'Sebep belirtmeden iade edebilirsiniz.',
              },
            ].map(({ title, body }) => (
              <motion.div
                key={title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={0.1}
                className="py-4"
              >
                <p
                  className="font-serif font-light text-black mb-1"
                  style={{ fontSize: '1.15rem', letterSpacing: '-0.015em' }}
                >
                  {title}
                </p>
                <p
                  className="font-sans font-light"
                  style={{ fontSize: '13px', color: 'rgba(10,10,10,0.50)' }}
                >
                  {body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
