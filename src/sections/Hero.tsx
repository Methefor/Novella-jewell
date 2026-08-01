'use client';

import type { Product } from '@/types/product';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

const ease = [0.16, 1, 0.3, 1] as const;

function productImage(product?: Product): string | null {
  if (!product) return null;
  return product.images?.[0] ?? product.variants[0]?.images?.[0] ?? null;
}

export default function Hero({ products }: { products: Product[] }) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const visualY = useTransform(scrollYProgress, [0, 1], ['0%', '-9%']);
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '24%']);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.62], [1, 0]);
  const images = products.map(productImage).filter((image): image is string => Boolean(image));
  const fallback = '/media/yuzuk/yuzuk-16c.jpg';
  const heroImages = [images[0] ?? fallback, images[1] ?? images[0] ?? fallback, images[2] ?? images[1] ?? images[0] ?? fallback];

  return (
    <section ref={ref} className="relative min-h-[760px] overflow-hidden bg-[#f1ece3] lg:min-h-[calc(100dvh-var(--navbar-h))]" aria-label="Novella yeni yüzük vitrini">
      <div className="absolute inset-0 texture-gold opacity-55" aria-hidden="true" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 76% 20%, rgba(255,255,255,.95), transparent 34%), linear-gradient(120deg, rgba(250,248,245,.85), rgba(232,221,201,.56))' }} aria-hidden="true" />
      <div className="container-custom relative grid min-h-[760px] items-center gap-10 pb-12 pt-12 lg:min-h-[calc(100dvh-var(--navbar-h))] lg:grid-cols-[.82fr_1.18fr] lg:pb-10 lg:pt-8">
        <motion.div style={{ y: reduceMotion ? undefined : copyY, opacity: reduceMotion ? undefined : copyOpacity }} className="relative z-20 max-w-[610px] pt-2 lg:pt-0">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease }} className="mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-[#8f7b50]/55" />
            <span className="text-[10px] font-medium uppercase tracking-[0.26em] text-[#8f7b50]">Novella · Yeni yüzük seçkisi</span>
          </motion.div>
          <h1 className="font-editorial text-[#16130f]" style={{ fontSize: 'clamp(3.35rem, 7.2vw, 7.6rem)', lineHeight: 0.86, letterSpacing: '-0.045em' }}>
            <RisingLine delay={0.2}>Özgün</RisingLine>
            <RisingLine delay={0.34} className="italic text-[#8f7b50]">parçalar.</RisingLine>
            <span className="mt-2 block font-serif text-[.56em] leading-[.98] tracking-[-.035em]">Ulaşılabilir bir lüks.</span>
          </h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.62, ease }} className="mt-7 max-w-md text-[14px] font-light leading-7 text-black/58 md:text-[15px]">
            Günlük stilinize karakter katan, suya dayanıklı 316L çelik yüzükler. Her parça Novella’nın modern ve zamansız dünyası için seçildi.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.78, ease }} className="mt-8 flex flex-wrap items-center gap-5">
            <Link href="/collections/yuzuk" className="group inline-flex min-h-12 items-center gap-4 rounded-full bg-[#16130f] px-6 text-sm font-medium text-white transition-colors hover:bg-[#8f7b50]">
              Yüzükleri keşfet <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/collections/yeni-gelenler" className="border-b border-black/25 pb-1 text-sm text-black/58 transition-colors hover:border-black hover:text-black">Yeni gelenler</Link>
          </motion.div>
          <div className="mt-9 flex flex-wrap gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.18em] text-black/42"><span>316L çelik</span><span>Suya dayanıklı</span><span>Hediye kutusunda</span></div>
        </motion.div>

        <motion.div style={{ y: reduceMotion ? undefined : visualY }} className="relative z-10 h-[430px] sm:h-[520px] lg:h-[min(78vh,760px)]" aria-hidden="true">
          <HeroFrame src={heroImages[1]} className="left-[1%] top-[18%] h-[58%] w-[42%] -rotate-[4deg]" delay={0.38} sizes="(max-width: 1023px) 45vw, 26vw" reduceMotion={!!reduceMotion} />
          <HeroFrame src={heroImages[0]} className="left-[28%] top-[2%] z-10 h-[78%] w-[51%] rotate-[2deg]" delay={0.18} sizes="(max-width: 1023px) 55vw, 34vw" reduceMotion={!!reduceMotion} priority />
          <HeroFrame src={heroImages[2]} className="bottom-[1%] right-[0%] z-20 h-[47%] w-[37%] rotate-[5deg]" delay={0.52} sizes="(max-width: 1023px) 40vw, 23vw" reduceMotion={!!reduceMotion} />
          <motion.div animate={reduceMotion ? undefined : { rotate: 360 }} transition={{ duration: 26, repeat: Infinity, ease: 'linear' }} className="absolute bottom-[9%] left-[12%] z-30 grid h-24 w-24 place-items-center rounded-full border border-[#8f7b50]/35 bg-[#faf8f5]/82 backdrop-blur-md">
            <span className="text-center text-[9px] uppercase leading-4 tracking-[.2em] text-[#8f7b50]">Novella<br />Selected</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function RisingLine({ children, delay, className = '' }: { children: React.ReactNode; delay: number; className?: string }) {
  return <span className={`block overflow-hidden pb-[.08em] ${className}`}><motion.span className="block" initial={{ y: '108%' }} animate={{ y: 0 }} transition={{ duration: 1.05, delay, ease }}>{children}</motion.span></span>;
}

function HeroFrame({ src, className, delay, sizes, priority = false, reduceMotion }: { src: string; className: string; delay: number; sizes: string; priority?: boolean; reduceMotion: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 42, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.15, delay, ease }} className={`absolute overflow-hidden bg-[#e7ded0] shadow-[0_24px_70px_rgba(65,46,24,.16)] ${className}`}>
      <motion.div animate={reduceMotion ? undefined : { scale: [1, 1.035, 1] }} transition={{ duration: 13 + delay * 3, repeat: Infinity, ease: 'easeInOut' }} className="absolute inset-0">
        <Image src={src} alt="" fill priority={priority} sizes={sizes} className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 ring-1 ring-inset ring-white/45" />
    </motion.div>
  );
}
