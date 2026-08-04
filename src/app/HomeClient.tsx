'use client';

import ProductCard from '@/components/product/ProductCard';
import type { Product } from '@/types/product';
import Hero from '@/sections/Hero';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Droplets,
  Gift,
  Instagram,
  MessageCircle,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  Truck,
} from 'lucide-react';
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

  const heroRings = products
    .filter((p) => p.category === 'yuzuk')
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 3);

  /**
   * Çok Satanlar — isBestSeller işaretine göre.
   * Eskiden ürün ID'leri elle yazılıydı (kupe-11, allBilezik[3]…); katalog
   * değişince kırılmaya açıktı ve gerçek satışla ilgisi yoktu.
   * Satış verisi Neon DB'den vitrine bağlandığında burası sipariş sayısına göre
   * hesaplanmalı; şimdilik işaretlenen ürünlerden en yenileri gösteriliyor.
   */
  const bestSellers = products
    .filter((p) => p.isBestSeller)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 6);

  return (
    <main>
      {/* Hero */}
      <Hero products={heroRings} />

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

          {featuredRings.length > 0 && (
            <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr] lg:gap-7">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeUp}
              >
                <EditorialFeature product={featuredRings[0]} />
              </motion.div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 lg:grid-cols-2">
                {featuredRings.slice(1).map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-40px' }}
                    variants={fadeUp}
                    custom={(index + 1) * 0.08}
                    className={index === 2 ? 'col-span-2 mx-auto w-1/2 lg:mx-0' : ''}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
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

      {/* Malzeme güveni — gerçek ürün ve kullanım görselleriyle. */}
      <section className="overflow-hidden bg-[#171713] py-20 text-white md:py-28">
        <div className="container-custom">
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeUp}
            >
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#cdbc91]">
                Malzemeyi tanıyın
              </p>
              <h2 className="mt-4 max-w-xl font-serif text-4xl font-light leading-[1.05] tracking-[-0.03em] md:text-6xl">
                Günlük hayat için seçilen{' '}
                <span className="italic text-[#cdbc91]">316L çelik.</span>
              </h2>
              <p className="mt-6 max-w-lg text-sm font-light leading-7 text-white/60 md:text-base">
                Suyla temas eden, gün boyu teninizde kalan bir takıda görünüm kadar
                malzeme de önemlidir. Novella parçaları suya dayanıklı ve kararmaya
                karşı dirençli 316L paslanmaz çelik esaslıdır.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  {
                    icon: Droplets,
                    title: 'Suya dayanıklı',
                    body: 'Duş ve günlük su temasında kullanım rahatlığı.',
                  },
                  {
                    icon: ShieldCheck,
                    title: 'Kararmaya dirençli',
                    body: 'Doğru bakımla rengini ve parlaklığını uzun süre korur.',
                  },
                ].map(({ icon: Icon, title, body }) => (
                  <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
                    <Icon className="h-5 w-5 text-[#cdbc91]" strokeWidth={1.6} />
                    <h3 className="mt-4 text-sm font-semibold">{title}</h3>
                    <p className="mt-2 text-xs leading-5 text-white/50">{body}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/rehber/316l-celik-nedir"
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#d9cba7] transition-colors hover:text-white"
              >
                316L çeliği yakından tanıyın
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <div className="grid grid-cols-[0.86fr_1.14fr] items-end gap-3 sm:gap-5">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease }}
                className="relative aspect-[3/4] overflow-hidden rounded-[1.4rem] border border-white/10"
              >
                <Image
                  src="/media/yuzuk/yuzuk-16c.jpg"
                  alt="316L çelik yüzüğün gerçek ürün yakın planı"
                  fill
                  sizes="(max-width: 1023px) 43vw, 24vw"
                  className="object-cover object-center"
                />
                <span className="absolute bottom-4 left-4 rounded-full bg-black/45 px-3 py-1.5 text-[9px] uppercase tracking-[0.16em] backdrop-blur-md">
                  Ürün detayı
                </span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 34 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.08, ease }}
                className="relative aspect-[4/5] overflow-hidden rounded-[1.4rem] border border-white/10"
              >
                <Image
                  src="/media/yuzuk/yuzuk-16b.jpg"
                  alt="Novella yüzüğün model üzerinde gerçek ürün görünümü"
                  fill
                  sizes="(max-width: 1023px) 57vw, 32vw"
                  className="object-cover object-center"
                />
                <span className="absolute bottom-4 left-4 rounded-full bg-black/45 px-3 py-1.5 text-[9px] uppercase tracking-[0.16em] backdrop-blur-md">
                  Günlük kullanım
                </span>
              </motion.div>
            </div>
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

      {/* Stil günlüğü — model üzerinde gerçek ürün görünümü ve sosyal kanallara köprü. */}
      <section className="overflow-hidden bg-[#f7f3ec] py-20 md:py-28">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            className="mb-10 flex flex-col justify-between gap-6 md:mb-14 md:flex-row md:items-end"
          >
            <div className="max-w-2xl">
              <p className="section-label mb-3">Novella stil günlüğü</p>
              <h2 className="font-serif text-4xl font-light leading-[1.05] tracking-[-0.035em] md:text-6xl">
                Bir yüzük, üç farklı{' '}
                <span className="italic text-gold-dark">ruh hali.</span>
              </h2>
            </div>
            <p className="max-w-sm text-sm font-light leading-6 text-black/50 md:text-right">
              Yakın plandan günlük stile: parçaların ölçüsünü, ışıltısını ve eldeki
              duruşunu satın almadan önce görün.
            </p>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-12 md:gap-5">
            {[
              {
                href: '/urun/stockholm-nova-yildiz-yuzuk',
                image: '/media/yuzuk/yuzuk-17c.jpg',
                alt: 'Stockholm Nova Yıldız Yüzük model üzerinde',
                mood: 'Cesur detay',
                name: 'Stockholm Nova',
                className: 'md:col-span-5 md:mt-16',
                aspect: 'aspect-[4/5]',
              },
              {
                href: '/urun/paris-amour-zincir-yuzuk',
                image: '/media/yuzuk/yuzuk-18b.jpg',
                alt: 'Paris Amour Zincir Yüzük model üzerinde',
                mood: 'Günlük zarafet',
                name: 'Paris Amour',
                className: 'md:col-span-4',
                aspect: 'aspect-[3/4]',
              },
              {
                href: '/urun/paris-grace-tektas-yuzuk',
                image: '/media/yuzuk/yuzuk-19b.jpg',
                alt: 'Paris Grace Tektaş Yüzük model üzerinde',
                mood: 'Modern klasik',
                name: 'Paris Grace',
                className: 'md:col-span-3 md:mt-28',
                aspect: 'aspect-[4/5]',
              },
            ].map((look, index) => (
              <motion.div
                key={look.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.8, delay: index * 0.08, ease }}
                className={look.className}
              >
                <Link href={look.href} className="group block">
                  <div className={`relative overflow-hidden bg-[#e7ded1] ${look.aspect}`}>
                    <Image
                      src={look.image}
                      alt={look.alt}
                      fill
                      sizes="(max-width: 767px) 100vw, 42vw"
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.025]"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute bottom-5 left-5 text-[10px] uppercase tracking-[0.2em] text-white/90">
                      {look.mood}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-b border-black/10 pb-4">
                    <h3 className="font-serif text-xl font-light">{look.name}</h3>
                    <ArrowRight className="h-4 w-4 text-black/40 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-14 border-y border-black/10 py-7 md:mt-20">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className="font-serif text-2xl font-light md:text-3xl">
                  Yeni stiller, bakım notları ve perde arkası.
                </p>
                <p className="mt-2 text-sm text-black/45">
                  Novella&apos;yı günlük akışında takip et.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.instagram.com/novellajewellofficial/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-gold-dark"
                >
                  <Instagram className="h-4 w-4" />
                  Instagram
                </a>
                <a
                  href="https://www.threads.com/@novellajewellofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-black/20 px-5 py-3 text-sm font-medium transition-colors hover:border-black hover:bg-white"
                >
                  <MessageCircle className="h-4 w-4" />
                  Threads
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Paketleme ve teslimat deneyimi — doğrulanabilir adımlarla. */}
      <section className="border-y border-border bg-cream-deep py-16 md:py-24">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-label mb-3">Sipariş deneyimi</p>
            <h2 className="font-serif text-3xl font-light tracking-[-0.025em] md:text-5xl">
              Seçiminden teslimata, özenle.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-black/50">
              Kendiniz için ya da hediye olarak seçin; siparişiniz korunaklı,
              sunuma hazır ve takip edilebilir şekilde hazırlanır.
            </p>
          </div>

          <div className="relative mt-12 grid gap-4 md:grid-cols-4 md:gap-0">
            <div className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-gold/30 md:block" />
            {[
              { icon: Gift, step: '01', title: 'Özel kutusunda', body: 'Takınız sunuma hazır Novella kutusunda hazırlanır.' },
              { icon: PackageCheck, step: '02', title: 'Kontrollü paketleme', body: 'Ürün, sipariş bilgileriyle eşleştirilerek korunaklı paketlenir.' },
              { icon: Truck, step: '03', title: 'Takipli teslimat', body: 'Kargoya verildiğinde sipariş durumunu takip edebilirsiniz.' },
              { icon: RotateCcw, step: '04', title: '14 gün cayma hakkı', body: 'Yasal istisnalar dışında iade talebinizi kolayca oluşturabilirsiniz.' },
            ].map(({ icon: Icon, step, title, body }, index) => (
              <motion.div
                key={title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={index * 0.08}
                className="relative rounded-2xl border border-gold/20 bg-white/60 p-5 text-center md:rounded-none md:border-y md:border-l-0 md:border-r md:bg-transparent md:px-6 md:py-8 md:first:border-l"
              >
                <div className="relative z-10 mx-auto grid h-14 w-14 place-items-center rounded-full border border-gold/35 bg-cream-deep text-gold-dark">
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                </div>
                <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.18em] text-gold-dark/70">{step}</p>
                <h3 className="mt-2 font-serif text-xl font-light">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-black/45">{body}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/kargo" className="rounded-full border border-gold/35 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-white">
              Kargo ve teslimat
            </Link>
            <Link href="/iade" className="rounded-full border border-gold/35 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-white">
              İade koşulları
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function EditorialFeature({ product }: { product: Product }) {
  const variant =
    product.variants.find((item) => item.id === product.defaultVariant) ??
    product.variants[0];
  const gallery = product.images?.length ? product.images : variant.images;
  const primary = gallery[0];
  const alternate = gallery[1];

  return (
    <Link
      href={`/urun/${product.slug}`}
      className="group relative block min-h-[560px] overflow-hidden rounded-[1.6rem] bg-[#e9e1d5] md:min-h-[680px] lg:h-full"
      aria-label={`${product.name} editoryal ürün görünümü`}
    >
      <Image
        src={primary}
        alt={`${product.name} ana görünüm`}
        fill
        priority
        sizes="(max-width: 1023px) 100vw, 58vw"
        className={`object-cover transition-all duration-1000 ease-out ${
          alternate ? 'group-hover:scale-[1.025] group-hover:opacity-0' : 'group-hover:scale-[1.025]'
        }`}
      />
      {alternate && (
        <Image
          src={alternate}
          alt={`${product.name} model veya yakın plan görünümü`}
          fill
          sizes="(max-width: 1023px) 100vw, 58vw"
          className="scale-[1.025] object-cover opacity-0 transition-all duration-1000 ease-out group-hover:scale-100 group-hover:opacity-100"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-black/5" />
      <div className="absolute left-5 top-5 flex items-center gap-2 md:left-7 md:top-7">
        <span className="rounded-full border border-white/35 bg-white/15 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur-md">
          Editörün seçimi
        </span>
        {alternate && (
          <span className="rounded-full border border-white/25 bg-black/15 px-3 py-1.5 text-[10px] text-white/80 backdrop-blur-md">
            Üzerine gel, detayını gör
          </span>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-6 text-white md:p-8">
        <div>
          <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-white/65">
            Yeni sezon · 316L çelik
          </p>
          <h3 className="max-w-xl font-serif text-3xl font-light leading-tight md:text-5xl">
            {product.name}
          </h3>
          <p className="mt-3 text-sm text-white/80">
            {product.price.toLocaleString('tr-TR')} ₺
          </p>
        </div>
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/40 bg-white/10 backdrop-blur-md transition-colors group-hover:bg-white group-hover:text-black">
          <ArrowRight className="h-5 w-5" />
        </span>
      </div>
    </Link>
  );
}
