'use client';

import ProductCard from '@/components/product/ProductCard';
import type { Collection } from '@/data/collections';
import { SHIPPING } from '@/lib/config';
import { CAYMA_SURESI_GUN } from '@/lib/legal';
import { getRelatedProducts } from '@/lib/products';
import { useCartStore } from '@/store/cartStore';
import type { Product } from '@/types/product';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, MessageCircle, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

interface Props {
  product: Product;
  collection: Collection | undefined;
}

const ease = [0.16, 1, 0.3, 1] as const;

const categoryLabel: Record<string, string> = {
  kupe: 'Küpe',
  bilezik: 'Bileklik',
  yuzuk: 'Yüzük',
};

const accordionItems = [
  {
    id: 'malzeme',
    title: 'Malzeme & Özellikler',
    content: [
      '316L paslanmaz çelik — tuz suyu, havuz, tere dayanıklı',
      'Nikel içermez, alerji yapmaz',
      'Renk solmaz, kararma yaşanmaz',
      'Zararlı kimyasal içermez',
    ],
  },
  {
    id: 'kargo',
    title: 'Kargo & İade',
    content: [
      '1–3 iş günü içinde kargoya verilir',
      // Eşik SHIPPING config'inden okunur — sabit yazılırsa sepetteki
      // gerçek hesapla çelişir ve yanıltıcı ticari uygulama olur.
      `${SHIPPING.freeThreshold.toLocaleString('tr-TR')} ₺ üzeri siparişlerde kargo ücretsiz`,
      `${CAYMA_SURESI_GUN} gün içinde cayma hakkı`,
      'Özenle paketlenir, hediye kutusunda gönderilir',
    ],
  },
  {
    id: 'bakim',
    title: 'Bakım',
    content: [
      'Parfüm ve kimyasallardan uzak tutun',
      'Kullanım sonrası yumuşak bir bezle silin',
      'Kapalı kutuda, karanlıkta saklayın',
      'Suyla temas sorun değil — çıkarmanız gerekmez',
    ],
  },
];

export default function ProductPageClient({ product, collection }: Props) {
  const addToCart = useCartStore((state) => state.addItem);

  const defaultVariant =
    product.variants.find((v) => v.id === product.defaultVariant) ??
    product.variants[0];

  const gallery = product.images ?? defaultVariant.images;
  const [activeImg, setActiveImg] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string>('malzeme');

  // Hareket azaltma tercihi açıksa yakınlaşma yapılmaz; geçiş yine de
  // çapraz söner (sert kesme rahatsız edici olurdu), sadece hareket kalkar.
  const galeriHareket = !useReducedMotion();

  /**
   * Galeri gezinmesi — kaydırma, klavye ve küçük resimler aynı mantığı kullanır.
   * Başa/sona gelince döner: son görselde sola kaydırınca ilkine geçer.
   */
  const gorselGec = useCallback(
    (yon: 1 | -1) => {
      setActiveImg((i) => (i + yon + gallery.length) % gallery.length);
    },
    [gallery.length]
  );

  // Klavye okları — masaüstünde galeri üzerindeyken ← → ile gezinme.
  useEffect(() => {
    if (gallery.length < 2) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') gorselGec(-1);
      else if (e.key === 'ArrowRight') gorselGec(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [gorselGec, gallery.length]);

  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;

  const related = getRelatedProducts(product.id, product.collection);

  const waText = encodeURIComponent(
    `Merhaba, *${product.name}* ürünü hakkında bilgi almak istiyorum.`
  );

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20">
          {/* ── Gallery (sol) ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease }}
            // items-start ŞART: grid, bu sütunu sağdaki ürün bilgisi sütununun
            // boyuna kadar geriyor. Geren yükseklik aspect-ratio'yu ezdiği için
            // ana görsel 1:1 yerine 2:3'e dönüşüp yanlardan kırpılıyordu.
            className="flex gap-3 items-start"
          >
            {/* Thumbnails */}
            {gallery.length > 1 && (
              <div className="flex flex-col gap-2 w-16 flex-shrink-0">
                {gallery.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImg(i)}
                    aria-label={`${i + 1}. görseli göster`}
                    aria-current={activeImg === i}
                    className={`relative w-16 overflow-hidden rounded-sm border transition-all duration-300 ${
                      activeImg === i
                        ? 'border-black opacity-100'
                        : 'border-transparent opacity-55 hover:opacity-90'
                    }`}
                    style={{ aspectRatio: '1/1' }}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover bg-[#F6F6F4]"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main image */}
            <motion.div
              className="relative flex-1 overflow-hidden bg-[#F6F6F4] touch-pan-y cursor-grab active:cursor-grabbing"
              style={{ aspectRatio: '1/1' }}
              /*
                Parmakla kaydırma. Trafiğin çoğu mobil olacak ve şu an tek
                gezinme yolu 64px'lik küçük resimlere dokunmak.

                touch-pan-y ŞART: yatay sürüklemeyi biz alırız ama dikey
                kaydırma tarayıcıda kalır. Olmazsa kullanıcı galeri üzerinde
                sayfayı aşağı kaydıramaz — parmağı galeriye takılır.
              */
              drag={gallery.length > 1 ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              dragMomentum={false}
              onDragEnd={(_, info) => {
                // Hem mesafe hem hız: yavaş uzun sürükleme de, hızlı kısa
                // fiske de çalışsın.
                const mesafe = info.offset.x;
                const hiz = info.velocity.x;
                if (mesafe < -60 || hiz < -450) gorselGec(1);
                else if (mesafe > 60 || hiz > 450) gorselGec(-1);
              }}
            >
              {/*
                mode="wait" YOK — bilerek.
                O ayar çıkan görselin tamamen kaybolmasını bekleyip sonra
                yenisini getiriyordu: A soluyor → boş gri zemin görünüyor →
                B beliriyor. Çapraz geçiş değil, arada göz kırpması olan bir
                kesme. Şimdi ikisi aynı anda sahnede: biri sönerken diğeri
                beliriyor, zemin hiç görünmüyor.
              */}
              <AnimatePresence initial={false}>
                <motion.div
                  key={activeImg}
                  initial={
                    galeriHareket ? { opacity: 0, scale: 1.06 } : { opacity: 0 }
                  }
                  animate={{ opacity: 1, scale: 1 }}
                  /*
                    Çıkan görsel TAM OPAK kalır, sonra bir anda kaldırılır.
                    Sebep: ikisi aynı anda yarı saydam olursa arkadaki gri
                    zemin ortada ~%25 sızar (0.5 üstüne 0.5 = 0.75 örtme).
                    Krem zeminli fotoğraflarda fark edilmez ama koyu zeminli
                    bileklik çekimlerinde gri bir titreme olarak görünür.
                    Böylece yeni görsel eskisinin ÜSTÜNE belirir, zemin hiç
                    devreye girmez.
                  */
                  exit={{ opacity: 0, transition: { duration: 0.01, delay: 0.5 } }}
                  transition={{
                    opacity: { duration: 0.5, ease: 'easeInOut' },
                    // Yakınlaşma sönümlemeden uzun sürer: görsel yerine
                    // oturmaya devam ederken geçiş çoktan bitmiş olur.
                    scale: { duration: 1.1, ease },
                  }}
                  className="absolute inset-0"
                >
                  <Image
                    src={gallery[activeImg]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    // priority yalnızca ilk görselde: diğerleri kullanıcı
                    // tıklayınca gerekiyor, sayfa açılışında indirmeye gerek yok.
                    priority={activeImg === 0}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                {product.isNew && (
                  <span className="bg-black text-white text-[10px] font-medium tracking-widest uppercase px-2 py-0.5">
                    Yeni
                  </span>
                )}
                {hasDiscount && (
                  <span className="bg-gold text-white text-[10px] font-medium px-2 py-0.5">
                    İndirimli
                  </span>
                )}
              </div>

              {/* Kaydırma ipucu — yalnızca mobilde ve birden fazla görsel varsa.
                  Kullanıcı kaydırılabildiğini bilmezse özellik yok sayılır. */}
              {gallery.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 sm:hidden">
                  {gallery.map((_, i) => (
                    <span
                      key={i}
                      aria-hidden="true"
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeImg === i
                          ? 'w-5 bg-black/70'
                          : 'w-1.5 bg-black/25'
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* ── Product info (sağ) ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.08 }}
            className="flex flex-col gap-6 lg:pt-2"
          >
            {/* Koleksiyon etiketi */}
            {collection && (
              <Link
                href={`/koleksiyonlar/${product.collection}`}
                className="section-label hover:text-gold transition-colors"
              >
                {collection.sehir || 'Klasikler'} Koleksiyonu ↗
              </Link>
            )}

            {/* Ürün adı */}
            <h1
              className="font-serif font-light text-black leading-tight"
              style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                letterSpacing: '-0.02em',
              }}
            >
              {product.name}
            </h1>

            {/* Mikro hikaye */}
            <div className="border-l-2 border-gold pl-4">
              <p className="font-serif italic text-black/60 leading-relaxed text-base">
                {product.story}
              </p>
            </div>

            {/* Fiyat */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-semibold text-black">
                {product.price.toLocaleString('tr-TR')} ₺
              </span>
              {hasDiscount && (
                <span className="text-base text-black/35 line-through">
                  {product.compareAtPrice!.toLocaleString('tr-TR')} ₺
                </span>
              )}
            </div>

            {/* CTA'lar */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => addToCart(product, product.defaultVariant, 1)}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Sepete Ekle
              </button>

              <a
                href={`https://wa.me/905451125059?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost w-full flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp ile Sipariş
              </a>
            </div>

            {/* Kategori + Malzeme chips */}
            <div className="flex gap-2 flex-wrap">
              <span className="pill pill-light">
                {categoryLabel[product.category] ?? product.category}
              </span>
              <span className="pill pill-light">316L Paslanmaz Çelik</span>
              <span className="pill pill-light">Suya Dayanıklı</span>
              <span className="pill pill-light">Alerji Yapmaz</span>
            </div>

            {/* Akordeon */}
            <div className="border-t border-black/8 pt-4 space-y-0">
              {accordionItems.map((item) => (
                <div key={item.id} className="border-b border-black/8">
                  <button
                    onClick={() =>
                      setOpenAccordion(openAccordion === item.id ? '' : item.id)
                    }
                    className="w-full flex items-center justify-between py-4 text-left"
                  >
                    <span className="text-sm font-medium text-black">
                      {item.title}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-black/40 transition-transform duration-300 ${
                        openAccordion === item.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {openAccordion === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <ul className="pb-4 space-y-1.5">
                          {item.content.map((line, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-black/60"
                            >
                              <span className="text-gold mt-0.5 flex-shrink-0">
                                ·
                              </span>
                              {line}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── "Aynı hikayeden" ── */}
        {related.length > 0 && (
          <section className="mt-24 border-t border-black/8 pt-14">
            <div className="flex items-baseline justify-between mb-8">
              <h2
                className="font-serif font-light text-2xl text-black"
                style={{ letterSpacing: '-0.02em' }}
              >
                Aynı hikayeden
              </h2>
              {collection && (
                <Link
                  href={`/koleksiyonlar/${product.collection}`}
                  className="text-xs text-black/40 hover:text-gold transition-colors"
                >
                  Tümünü gör →
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
