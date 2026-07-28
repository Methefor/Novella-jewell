'use client';

import ProductCard from '@/components/product/ProductCard';
import type { Product } from '@/types/product';
import Hero from '@/sections/Hero';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
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

const categoryShowcase = [
  {
    title: 'Yüzükler',
    eyebrow: 'Yeni sezon',
    href: '/collections/yuzuk',
    image: '/media/yuzuk/yuzuk-16c.jpg',
    position: 'object-[50%_55%]',
  },
  {
    title: 'Küpeler',
    eyebrow: 'Zarif detay',
    href: '/collections/kupe',
    image: '/media/kupe/kupe-1.jpg',
    position: 'object-center',
  },
  {
    title: 'Bileklikler',
    eyebrow: 'Günlük ışıltı',
    href: '/collections/bilezik',
    image: '/media/bileklik/bileklik-1.jpg',
    position: 'object-center',
  },
] as const;

export default function HomeClient({ products }: { products: Product[] }) {

  // Ana vitrinde en yeni yüzükler otomatik olarak editoryal sıraya girer.
  const featuredRings = products
    .filter((p) => p.isNew && p.category === 'yuzuk')
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 4);

  /**
   * Çok Satanlar — isBestSeller işaretine göre.
   * Eskiden ürün ID'leri elle yazılıydı (kupe-11, allBilezik[3]…); katalog
   * değişince kırılmaya açıktı ve gerçek satışla ilgisi yoktu.
   * Gerçek satış verisi (Supabase) gelince burası sipariş sayısına göre
   * hesaplanmalı; şimdilik işaretlenen ürünlerden en yenileri gösteriliyor.
   */
  const bestSellers = products
    .filter((p) => p.isBestSeller)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 6);

  return (
    <main>
      {/* Hero */}
      <Hero />

      {/* İlk kaydırmada mağazanın ürün kapsamını açıkça gösterir. */}
      <section className="border-b border-gold/20 bg-cream py-10 md:py-14">
        <div className="container-custom">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="section-label mb-2">Kategorileri keşfet</p>
              <h2 className="font-serif text-2xl font-light tracking-[-0.02em] text-black md:text-3xl">
                Stilinin parçasını seç.
              </h2>
            </div>
            <Link href="/urunler" className="hidden items-center gap-2 text-sm text-black/50 transition-colors hover:text-black sm:inline-flex">
              Tüm ürünler <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {categoryShowcase.map((category, index) => (
              <motion.div
                key={category.href}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeUp}
                custom={index * 0.08}
              >
                <Link
                  href={category.href}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-[1.35rem] bg-[#e9e1d4] md:aspect-[4/3]"
                >
                  <Image
                    src={category.image}
                    alt={`${category.title} kategorisi`}
                    fill
                    sizes="(max-width: 767px) 100vw, 33vw"
                    className={`object-cover transition-transform duration-700 group-hover:scale-[1.035] ${category.position}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white md:p-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/70">
                        {category.eyebrow}
                      </p>
                      <h3 className="mt-1 font-serif text-3xl font-light">
                        {category.title}
                      </h3>
                    </div>
                    <span className="grid h-10 w-10 place-items-center rounded-full border border-white/45 bg-white/10 backdrop-blur-sm transition-colors group-hover:bg-white group-hover:text-black">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Yeni yüzük vitrini */}
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
              <p className="section-label mb-3">Yeni Sezon</p>
              <h2
                className="font-serif font-light text-black"
                style={{
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.025em',
                }}
              >
                Yeni Yüzükler
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-black/50 md:text-base">
                Yeni sezonun seçili tasarımları, güçlü parçadan zarif tektaşa
                uzanan editoryal bir seçkide.
              </p>
            </div>
            <Link
              href="/collections/yuzuk"
              className="inline-flex items-center gap-2 text-sm font-sans font-medium text-black/50 hover:text-black transition-colors duration-200 group flex-shrink-0"
            >
              Tüm Yüzükleri Gör
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-4">
            {featuredRings.map((product, i) => (
              <motion.div
                key={product.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeUp}
                custom={i * 0.07}
                className="lg:col-span-1"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container-custom">
        <hr className="rule-gold" />
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
              <p className="section-label mb-3">İlgi Görenler</p>
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

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
              Novella,{' '}
              <span className="italic text-gold-dark">kısa hikaye</span> demek.
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
      <section className="py-14 md:py-16 bg-cream-deep border-y border-border">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
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
                className="py-2"
              >
                <div className="flex items-center justify-center mb-3">
                  <span className="h-px w-6 bg-gold/40" aria-hidden="true" />
                </div>
                <p
                  className="font-serif font-light text-black mb-1.5"
                  style={{ fontSize: '1.2rem', letterSpacing: '-0.015em' }}
                >
                  {title}
                </p>
                <p
                  className="font-sans font-light"
                  style={{ fontSize: '13px', color: 'rgba(10,10,10,0.45)' }}
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
