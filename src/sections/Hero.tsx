'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  HERO GÖRSELİ — TEK AYAR NOKTASI                             ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * İki mod var. Hangisinin çalışacağını HERO_WRIST belirler.
 *
 * ── MOD 1: BİLEK (hedeflenen tasarım) ─────────────────────────
 *   const HERO_WRIST = '/media/hero-wrist.jpg';
 *
 *   Bilek fotoğrafı aşağıdan yukarı doğru yükselir, alt kenarı ışığa
 *   karışarak kaybolur, bileklik üzerinden altın bir ışık geçer.
 *   Kaydırdıkça bilek yükselmeye devam eder (parallax).
 *
 *   FOTOĞRAF ŞARTNAMESİ (buna uyarsa tasarım birebir oturur):
 *   • Dikey, 3:4 veya 2:3 (örn. 1200×1600). Yatay ÇEKME.
 *   • Kol aşağıdan yukarı doğru, hafif çapraz. Bilek karenin ÜST
 *     yarısında olsun — alt kısım boş kalacak, oraya ışık karışacak.
 *   • Arka plan sade ve AÇIK: krem/bej duvar, tercihen pencere ışığı.
 *     Koyu veya kalabalık arka plan tasarımı bozar.
 *   • Işık: pencereden gelen yumuşak yan ışık. Flaş kullanma.
 *   • Bileklik NET olsun, arka plan hafif bulanık.
 *   • Kadraj: parmak uçlarından dirseğe kadar değil — el bileği ve
 *     önkolun yarısı yeterli. Yüz girmesin.
 *   • Ten tonu doğal kalsın, aşırı filtre uygulama.
 *
 *   ⚠️ Fotoğraftaki bileklik SATTIĞIN ürünün TA KENDİSİ olmalı.
 *   Farklı bir bileklik göstermek yanıltıcı ticari uygulamadır.
 *
 * ── MOD 2: MADALYON (yedek) ───────────────────────────────────
 *   const HERO_WRIST = null;
 *
 *   Hiç uygun görsel yoksa, ürün çekimi dairesel madalyonda gelir.
 *   Daire seçildi çünkü ürün çekimleri kare — dikey çerçeve onları
 *   kenarlardan kesiyor.
 *
 * ── ŞU ANKİ DURUM ─────────────────────────────────────────────
 *   Bilek fotoğrafı henüz yok. Yerine gerçek bir ürün çekimi
 *   (ipek üzerinde çapraz bileklik) MOD 1'de kullanılıyor; kenarları
 *   zemine eridiği için hero olarak iyi duruyor. Bilek fotoğrafı
 *   çekilince aşağıdaki yol onunla değiştirilecek — başka hiçbir
 *   şeye dokunmaya gerek yok.
 */
const HERO_WRIST: string | null = '/media/yuzuk/yuzuk-16c.jpg';

/** MOD 2 yedeği — HERO_WRIST null olursa devreye girer. */
const HERO_PRODUCT = '/media/bileklik/bileklik-1.jpg';

const featurePills = ['Suya Dayanıklı', 'Alerji Yapmaz', 'Hediye Kutusunda'];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // Kaydırdıkça görsel yükselmeye devam eder — "yukarı çıkma" hissini sürdürür.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '-14%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '38%']);
  const textFade = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  const hasWrist = HERO_WRIST !== null;

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden bg-champagne"
      style={{ height: 'calc(100dvh - var(--navbar-h, 64px))' }}
      aria-label="Ana hero bölümü"
    >
      {/* Doku katmanları — saf CSS, asset bağımlılığı yok */}
      <div className="absolute inset-0 texture-gold" aria-hidden="true" />
      <div className="absolute inset-0 texture-lines" aria-hidden="true" />

      {/* Yukarıdan inen ışık huzmesi — bileği aydınlatan kaynak hissi */}
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2 w-[130vw] sm:w-[80vw] h-[65vh] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(255,252,244,0.95) 0%, rgba(247,238,220,0.45) 45%, transparent 75%)',
        }}
        aria-hidden="true"
      />

      {/* ─────────── Görsel: aşağıdan yukarı yükselir ─────────── */}
      <motion.div
        style={{ y: reduceMotion ? undefined : imageY }}
        className="absolute inset-x-0 bottom-0 top-0 flex items-end justify-center pointer-events-none"
        aria-hidden="true"
      >
        <HeroVisual hasWrist={hasWrist} reduceMotion={!!reduceMotion} />
      </motion.div>

      {/* ─────────── Metin ─────────── */}
      <motion.div
        style={{
          y: reduceMotion ? undefined : textY,
          opacity: reduceMotion ? undefined : textFade,
        }}
        className="relative h-full flex flex-col items-center justify-start pt-[8vh] sm:pt-[10vh] px-6"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease }}
          className="flex items-center justify-center gap-3 mb-5"
        >
          <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
          <span className="font-sans font-light text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-gold-dark">
            El seçimi paslanmaz çelik
          </span>
          <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
        </motion.div>

        {/* H1 — kelimeler tek tek yükselir */}
        <h1
          className="font-serif font-light text-black text-center text-balance mb-6"
          style={{
            fontSize: 'clamp(2.3rem, 6.5vw, 4.6rem)',
            lineHeight: 1.02,
            letterSpacing: '-0.035em',
          }}
        >
          <RisingLine delay={0.3}>Kararmayan çelik.</RisingLine>
          <RisingLine delay={0.45}>
            <span className="italic text-gold-dark">Eskimeyen zarafet.</span>
          </RisingLine>
        </h1>

        {/* Pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease }}
          className="flex flex-wrap items-center justify-center gap-2 mb-7"
          role="list"
          aria-label="Ürün özellikleri"
        >
          {featurePills.map((label) => (
            <span
              key={label}
              className="px-3.5 py-1.5 rounded-full font-sans font-light text-[12px] text-black/60 bg-white/55 border border-gold/25 backdrop-blur-sm"
              role="listitem"
            >
              {label}
            </span>
          ))}
        </motion.div>

        {/* Butonlar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85, ease }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/koleksiyonlar"
            className="inline-flex items-center justify-center min-h-[46px] px-7 bg-black text-white rounded-full hover:bg-gold transition-colors duration-300 text-sm font-medium tracking-wide"
          >
            Koleksiyonu Keşfet
          </Link>
          <Link
            href="/hikayemiz"
            className="inline-flex items-center justify-center min-h-[46px] px-7 text-black border border-gold/45 rounded-full hover:border-gold hover:bg-white/50 transition-colors duration-300 text-sm font-medium"
          >
            Hikayemiz
          </Link>
        </motion.div>
      </motion.div>

      {/* Kaydırma ipucu */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6, ease }}
        style={{ opacity: reduceMotion ? undefined : textFade }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none"
        aria-hidden="true"
      >
        <motion.span
          animate={reduceMotion ? undefined : { y: [0, 7, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="block h-8 w-px bg-gradient-to-b from-transparent via-gold/60 to-transparent"
        />
      </motion.div>

      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-gold/50"
        aria-hidden="true"
      />
    </section>
  );
}

/** H1 satırı — maskeli kutudan yukarı doğru yükselir. */
function RisingLine({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        initial={{ y: '105%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 1.1, delay, ease }}
        className="block"
      >
        {children}
      </motion.span>
    </span>
  );
}

/**
 * Görsel katmanı.
 * Bilek fotoğrafı varsa tam genişlikte yükselir; yoksa ürün çekimi
 * kemerli çerçevede aynı hareketle gelir.
 */
function HeroVisual({
  hasWrist,
  reduceMotion,
}: {
  hasWrist: boolean;
  reduceMotion: boolean;
}) {
  // Kenarların arka plana karışması.
  // Sadece alt kenarı yumuşatmak yetmiyor: sol/sağ/üst sert kalınca görsel
  // zemine yapıştırılmış bir dikdörtgen gibi duruyor. Elips maske her yönden
  // eritir, böylece bilek ışığın içinden çıkıyormuş gibi görünür.
  const feather =
    'radial-gradient(ellipse 72% 60% at 50% 40%, #000 40%, rgba(0,0,0,0.85) 62%, transparent 88%)';

  if (hasWrist) {
    return (
      <motion.div
        initial={reduceMotion ? undefined : { y: '18%', scale: 1.08, opacity: 0 }}
        animate={{ y: '0%', scale: 1, opacity: 1 }}
        transition={{ duration: 1.8, delay: 0.15, ease }}
        className="relative w-full max-w-[560px] h-[88%]"
        style={{
          maskImage: feather,
          WebkitMaskImage: feather,
        }}
      >
        <Image
          src={HERO_WRIST!}
          alt=""
          fill
          priority
          sizes="(max-width: 640px) 100vw, 560px"
          className="object-cover object-center"
        />

        {/* Metin perdesi — başlık görselin üstüne geldiğinde okunurluğu
            garanti eder. Fotoğrafın açık/koyu olmasından bağımsız çalışır. */}
        <div
          className="absolute inset-x-0 top-0 h-[52%] pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(250,248,245,0.92) 0%, rgba(250,248,245,0.55) 55%, transparent 100%)',
          }}
        />

        <GoldSweep reduceMotion={reduceMotion} />
      </motion.div>
    );
  }

  // ── Ürün modu: dairesel madalyon ──
  // Daire seçildi çünkü ürün çekimleri KARE. Dikey bir çerçeveye
  // zorlamak bilekliği kenarlardan kesiyor; daire kare görseli
  // kırpmadan taşır.
  return (
    <motion.div
      initial={reduceMotion ? undefined : { y: '16%', opacity: 0 }}
      animate={{ y: '0%', opacity: 1 }}
      transition={{ duration: 1.6, delay: 0.25, ease }}
      className="relative mb-[9vh] w-[min(62vw,300px)] aspect-square"
    >
      {/* Altın hale — madalyonun arkasından sızan ışık */}
      <div
        className="absolute -inset-12 rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(184,165,116,0.42) 0%, transparent 65%)',
        }}
      />

      <div className="relative w-full h-full rounded-full overflow-hidden border border-gold/35 shadow-[0_20px_60px_rgba(120,100,60,0.18)]">
        <motion.div
          initial={reduceMotion ? undefined : { scale: 1.16 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.6, delay: 0.25, ease }}
          className="absolute inset-0"
        >
          <Image
            src={HERO_PRODUCT}
            alt=""
            fill
            priority
            sizes="(max-width: 640px) 62vw, 300px"
            className="object-cover object-center"
          />
        </motion.div>

        <GoldSweep reduceMotion={reduceMotion} />
      </div>
    </motion.div>
  );
}

/** Görselin üzerinden bir kez geçen altın ışık — metalin parladığı an. */
function GoldSweep({ reduceMotion }: { reduceMotion: boolean }) {
  if (reduceMotion) return null;

  return (
    <motion.div
      // x 240%'e kadar gider: 130%'te durursa yarım genişlikteki şerit
      // görselin sağ kenarında park edip görünür bir dikey çizgi bırakıyor.
      // opacity de sonda sıfırlanır ki hiçbir iz kalmasın.
      initial={{ x: '-140%', opacity: 0 }}
      animate={{ x: '240%', opacity: [0, 1, 1, 0] }}
      transition={{
        duration: 2.1,
        delay: 1.15,
        ease: 'easeInOut',
        opacity: { duration: 2.1, delay: 1.15, times: [0, 0.15, 0.8, 1] },
      }}
      className="absolute inset-y-0 w-1/2 pointer-events-none"
      style={{
        background:
          'linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.42) 45%, rgba(255,245,220,0.28) 60%, transparent 100%)',
      }}
    />
  );
}
