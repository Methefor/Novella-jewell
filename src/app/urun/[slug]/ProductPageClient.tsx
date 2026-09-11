'use client';
import { PRODUCT_CARE } from '@/lib/product-care';

import BedenRehberi from '@/components/product/BedenRehberi';
import LinkToPackaging from '@/components/product/LinkToPackaging';
import FavoriButton from '@/components/product/FavoriButton';
import Lightbox from '@/components/product/Lightbox';
import ProductCard from '@/components/product/ProductCard';
import SonGoruntulenenler from '@/components/product/SonGoruntulenenler';
import Yorumlar from '@/components/product/Yorumlar';
import type { Collection } from '@/data/collections';
import { trackAddToCart, trackViewItem } from '@/lib/analytics';
import { SHIPPING, SITE } from '@/lib/config';
import { CAYMA_SURESI_GUN } from '@/lib/legal';
import { dusukStok, getPurchasableVariant, OUT_OF_STOCK_LABEL } from '@/lib/products';
import { useCartStore } from '@/store/cartStore';
import type { Product } from '@/types/product';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Gift,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
  Truck,
  ZoomIn,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
  product: Product;
  related: Product[];
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
      PRODUCT_CARE.material,
      PRODUCT_CARE.allergy,
      PRODUCT_CARE.finish,
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
      'Seçtiğiniz ürün, Novella kartvizitiyle birlikte özel kutusunda gönderilir',
    ],
  },
  {
    id: 'bakim',
    title: 'Bakım',
    content: [
      'Parfüm ve kimyasallardan uzak tutun',
      'Kullanım sonrası yumuşak bir bezle silin',
      'Kapalı kutuda, karanlıkta saklayın',
      PRODUCT_CARE.water,
    ],
  },
];

export default function ProductPageClient({ product, collection, related }: Props) {
  const addToCart = useCartStore((state) => state.addItem);

  const defaultVariant =
    product.variants.find((v) => v.id === product.defaultVariant) ??
    product.variants[0];

  const gallery = product.images ?? defaultVariant.images;
  const [activeImg, setActiveImg] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string>('malzeme');
  const [zoomAcik, setZoomAcik] = useState(false);
  const [mobilSabitCta, setMobilSabitCta] = useState(false);
  const anaSepetButonu = useRef<HTMLButtonElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const stokBilgi = dusukStok(product);
  const purchaseVariant = getPurchasableVariant(product);

  // GA4 view_item — ürün sayfası açıldığında bir kez.
  useEffect(() => {
    trackViewItem(product);
  }, [product]);

  useEffect(() => {
    const button = anaSepetButonu.current;
    if (!button) return;

    const observer = new IntersectionObserver(
      ([entry]) => setMobilSabitCta(!entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(button);
    return () => observer.disconnect();
  }, []);

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



  const sepeteEkle = () => {
    if (!purchaseVariant) return;
    addToCart(product, purchaseVariant.id, 1);
    trackAddToCart(product, 1);
  };

  const waText = encodeURIComponent(
    `Merhaba, *${product.name}* ürünü hakkında bilgi almak istiyorum.`
  );

  return (
    <main className="min-h-screen bg-white pb-24 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-24 pb-20">
        <nav aria-label="Sayfa yolu" className="mb-7 text-xs text-black/60"><ol className="flex flex-wrap items-center gap-x-2 gap-y-1"><li><Link className="hover:underline" href="/">Ana sayfa</Link></li><li aria-hidden="true">/</li><li><Link className="hover:underline" href={`/collections/${product.category}`}>{categoryLabel[product.category] ?? 'Ürünler'}</Link></li><li aria-hidden="true">/</li><li aria-current="page" className="text-black/80">{product.name}</li></ol></nav>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-20">
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
              <div className="hidden sm:flex flex-col gap-2 w-16 flex-shrink-0">
                {gallery.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImg(i)}
                    aria-label={`${i + 1}. görseli göster`}
                    aria-current={activeImg === i}
                    className={`relative w-16 overflow-hidden rounded-lg border transition-all duration-300 ${
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
            <div
              className="relative flex-1 overflow-hidden bg-[#F6F6F4] rounded-lg touch-pan-y"
              style={{ aspectRatio: '1/1' }}
              onTouchStart={(event) => {
                const touch = event.touches[0];
                touchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
              }}
              onTouchEnd={(event) => {
                const start = touchStart.current;
                const touch = event.changedTouches[0];
                touchStart.current = null;
                if (!start || !touch || gallery.length < 2) return;
                const deltaX = touch.clientX - start.x;
                const deltaY = touch.clientY - start.y;
                if (Math.abs(deltaX) < 44 || Math.abs(deltaX) <= Math.abs(deltaY) * 1.15) return;
                gorselGec(deltaX < 0 ? 1 : -1);
              }}
              onTouchCancel={() => {
                touchStart.current = null;
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  /*
                    Çıkan görsel TAM OPAK kalır, sonra bir anda kaldırılır.
                    Sebep: ikisi aynı anda yarı saydam olursa arkadaki gri
                    zemin ortada ~%25 sızar (0.5 üstüne 0.5 = 0.75 örtme).
                    Krem zeminli fotoğraflarda fark edilmez ama koyu zeminli
                    bileklik çekimlerinde gri bir titreme olarak görünür.
                    Böylece yeni görsel eskisinin ÜSTÜNE belirir, zemin hiç
                    devreye girmez.
                  */
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.01, delay: 0.5 },
                  }}
                  transition={{
                    opacity: { duration: 0.32, ease: 'easeInOut' },
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
                  <span className="bg-black text-white text-[10px] font-medium tracking-widest uppercase px-2.5 py-1 rounded-full">
                    Yeni
                  </span>
                )}
                {hasDiscount && (
                  <span className="bg-gold text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
                    İndirimli
                  </span>
                )}
              </div>

              {/* Zoom yalnızca bu düğmeyle açılır; yatay kaydırmayla çakışmaz. */}
              <button
                type="button"
                onClick={() => setZoomAcik(true)}
                aria-label="Ürün görselini büyüt"
                className="absolute top-3 right-3 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-black/65 shadow-sm transition-colors hover:bg-white"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => gorselGec(-1)}
                    aria-label="Önceki ürün görseli"
                    className="absolute left-3 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-black/65 shadow-sm backdrop-blur-sm sm:hidden"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => gorselGec(1)}
                    aria-label="Sonraki ürün görseli"
                    className="absolute right-3 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-black/65 shadow-sm backdrop-blur-sm sm:hidden"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

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
            </div>
          </motion.div>

          {/* ── Product info (sağ) ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.08 }}
            className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start lg:pt-2"
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
            <div className="border-l border-gold/40 pl-5">
              <p className="font-serif italic text-black/55 leading-relaxed text-base">
                {product.story}
              </p>
            </div>

            {/* Fiyat */}
            <p className="text-sm leading-relaxed text-black/65">{product.description}</p>

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

            {/* Düşük stok — yalnızca gerçekten az kaldıysa. Sayı GERÇEK stok. */}
            {!purchaseVariant && (
              <p className="rounded-xl border border-gold/25 bg-cream px-4 py-3 text-sm font-medium text-black/70">
                {OUT_OF_STOCK_LABEL}
              </p>
            )}
            {stokBilgi.goster && (
              <div className="flex items-center gap-2 text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold/60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
                </span>
                <span className="text-gold-dark font-medium">
                  Son {stokBilgi.adet} adet
                </span>
              </div>
            )}

            {/* CTA'lar */}
            <div className="flex flex-col gap-3">
              <button
                ref={anaSepetButonu}
                onClick={sepeteEkle}
                disabled={!purchaseVariant}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ShoppingBag className="w-4 h-4" />
                {purchaseVariant ? 'Sepete Ekle' : 'Stokta yok'}
              </button>

              <div className="flex gap-3">
                <a
                  href={`https://wa.me/${SITE.whatsapp}?text=${waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost flex-1 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
                <div className="flex-1">
                  <FavoriButton product={product} variant="detail" />
                </div>
              </div>

              <LinkToPackaging />

              {/* Beden rehberi — yalnızca yüzükte. Online takıda en büyük
                  iade sebebi ölçü tutmaması; rehber iadeyi düşürür. */}
              {product.category === 'yuzuk' && (
                <div className="pt-1">
                  <BedenRehberi />
                </div>
              )}
            </div>

            {/* Satın alma kararının yanında görünür, doğrulanabilir güven bilgileri. */}
            <div className="grid grid-cols-2 border-y border-black/10">
              {[
                {
                  icon: Droplets,
                  title: 'Suya dayanıklı',
                  body: 'Günlük kullanım için',
                },
                {
                  icon: ShieldCheck,
                  title: '316L çelik',
                  body: 'Kararmaya dirençli',
                },
                {
                  icon: Gift,
                  title: 'Hediye kutusunda',
                  body: 'Sunuma hazır',
                },
                {
                  icon: Truck,
                  title: 'Takipli teslimat',
                  body: '1–3 iş gününde kargoda',
                },
              ].map(({ icon: Icon, title, body }, index) => (
                <div
                  key={title}
                  className={`flex gap-3 py-4 ${
                    index % 2 === 0
                      ? 'border-r border-black/10 pr-3'
                      : 'pl-4'
                  } ${index < 2 ? 'border-b border-black/10' : ''}`}
                >
                  <Icon
                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-dark"
                    strokeWidth={1.6}
                  />
                  <div>
                    <p className="text-xs font-semibold text-black">{title}</p>
                    <p className="mt-1 text-[11px] leading-4 text-black/45">
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Kategori + Malzeme chips */}
            <div className="flex gap-2 flex-wrap">
              <span className="pill pill-light">
                {categoryLabel[product.category] ?? product.category}
              </span>
              <span className="pill pill-light">316L Paslanmaz Çelik</span>
              <span className="pill pill-light">Suya Dayanıklı</span>
              <span className="pill pill-light">Bakım Bilgileri</span>
            </div>

            {/* Güvence şeridi — premium marka hissi */}
            {/* Akordeon */}
            <div className="border-t border-black/8 pt-5 space-y-0">
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

            {/* SSS'e iç link — merak edilenlerin tamamı orada.
                Not: FAQPage schema BİLEREK burada değil, /sss'te. Aynı jenerik
                FAQ markup'ını 80 ürün sayfasına basmak yinelenen işaretleme
                olur; Google 2023'ten beri FAQ zengin sonuçlarını zaten yalnızca
                yetkili sitelerde gösteriyor. İç link ise güvenli SEO değeri. */}
            <Link
              href="/sss"
              className="inline-flex items-center gap-1.5 mt-6 text-sm text-black/50 hover:text-gold-dark transition-colors"
            >
              Tüm sorular ve cevaplar
              <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </div>

        {/* ── "Aynı hikayeden" ── */}
        {related.length > 0 && (
          <section className="mt-24 border-t border-black/8 pt-16">
            <div className="flex items-baseline justify-between mb-10">
              <div>
                <p className="section-label mb-2">Devamı</p>
                <h2
                  className="font-serif font-light text-2xl text-black"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  Aynı hikayeden
                </h2>
              </div>
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

        {/* Müşteri değerlendirmeleri — sosyal kanıt */}
        <Yorumlar productId={product.id} urunAdi={product.name} />

        {/* Son görüntülenenler — bu ürünü geçmişe ekler + öncekileri gösterir */}
        <SonGoruntulenenler currentId={product.id} />
      </div>

      {/* Tam ekran büyüteç — ana görsele tıklanınca açılır. */}
      <AnimatePresence>
        {zoomAcik && (
          <Lightbox
            gallery={gallery}
            index={activeImg}
            urunAdi={product.name}
            onClose={() => setZoomAcik(false)}
            onIndexChange={setActiveImg}
          />
        )}
      </AnimatePresence>

      {/* Mobilde ürün içeriği incelenirken satın alma eylemi her zaman erişilebilir. */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-lg transition-all duration-300 lg:hidden ${
          mobilSabitCta
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-full opacity-0'
        }`}
      >
        <div className="mx-auto flex max-w-lg items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] text-black/45">{product.name}</p>
            <p className="mt-0.5 text-base font-semibold text-black">
              {product.price.toLocaleString('tr-TR')} ₺
            </p>
          </div>
          <button
            type="button"
            onClick={sepeteEkle}
            disabled={!purchaseVariant}
            className="inline-flex min-h-12 flex-shrink-0 items-center justify-center gap-2 rounded-full bg-black px-6 text-sm font-semibold text-white transition-colors hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShoppingBag className="h-4 w-4" />
            {purchaseVariant ? 'Sepete Ekle' : 'Stokta yok'}
          </button>
        </div>
      </div>
    </main>
  );
}
