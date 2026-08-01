'use client';

import CartDrawer from '@/components/cart/CartDrawer';
import SearchModal from '@/components/search/SearchModal';
import { SITE } from '@/lib/config';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import { ArrowUpRight, Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const ease = [0.16, 1, 0.3, 1] as const;

const navLinks = [
  { label: 'Ürünler', href: '/urunler' },
  { label: 'Yeni Gelenler', href: '/collections/yeni-gelenler' },
  { label: 'Koleksiyonlar', href: '/koleksiyonlar' },
  { label: 'Hikayemiz', href: '/hikayemiz' },
  { label: 'İletişim', href: '/#iletisim' },
];

const menuCategories = [
  { label: 'Yüzükler', note: 'Özgün formlar', href: '/collections/yuzuk', image: '/media/yuzuk/yuzuk-16c.jpg' },
  { label: 'Yeni gelenler', note: 'Son seçkiler', href: '/collections/yeni-gelenler', image: '/media/yuzuk/yuzuk-15.jpg' },
  { label: 'Küpeler', note: 'Zarif detaylar', href: '/collections/kupe', image: '/media/kupe/kupe-1.jpg' },
  { label: 'Bileklikler', note: 'Günlük ışıltı', href: '/collections/bilezik', image: '/media/bileklik/bileklik-1.jpg' },
] as const;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartCount = useCartStore((s) => s.items.length);
  const isDrawerOpen = useCartStore((s) => s.isDrawerOpen);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const wishlistCount = useWishlistStore((s) => s.items.length);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 40));

  return (
    <>
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease }}
        style={{ height: 'var(--navbar-h)' }}
        className={`sticky top-0 z-50 flex items-center transition-all duration-300 ${
          scrolled
            ? 'bg-white/96 backdrop-blur-md shadow-xs border-b border-black/4'
            : 'bg-white'
        }`}
      >
        <div className="container-custom flex items-center justify-between w-full">
          {/* Left group */}
          <div className="flex items-center gap-3">
            {/* Logotype */}
            <Link
              href="/"
              className="font-serif text-[22px] font-medium tracking-[0.15em] text-black leading-none"
            >
              NOVELLA
            </Link>

            {/* Editorial discovery trigger */}
            <button
              onClick={() => setMenuOpen(true)}
              className="group flex items-center gap-2 border-l border-black/12 py-1 pl-3 text-black/60 transition-colors hover:text-black"
              aria-label="Menüyü aç"
            >
              <Menu className="h-[17px] w-[17px]" />
              <span className="hidden text-[11px] font-medium uppercase tracking-[0.14em] sm:inline">Keşfet</span>
            </button>
          </div>

          <nav
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 lg:flex"
            aria-label="Ürün kategorileri"
          >
            {[
              ['Yeni Gelenler', '/collections/yeni-gelenler'],
              ['Yüzük', '/collections/yuzuk'],
              ['Küpe', '/collections/kupe'],
              ['Bileklik', '/collections/bilezik'],
              ['Koleksiyonlar', '/koleksiyonlar'],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="whitespace-nowrap text-[12px] font-medium text-black/55 transition-colors hover:text-black"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right group */}
          <div className="flex items-center gap-1">
            {/* New collection pill — desktop only */}
            <Link
              href="/collections/yeni-gelenler"
              className="hidden md:flex items-center gap-2 px-3 py-[7px] bg-[#F4F4F6] rounded-full hover:bg-[#EBEBED] transition-colors duration-200 mr-2"
            >
              <span className="text-[11px] font-sans font-light text-black/60">
                Yeni Koleksiyon
              </span>
              <span className="w-[14px] h-[14px] rounded-full bg-black flex-shrink-0" />
            </Link>

            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 text-black/40 hover:text-black transition-colors"
              aria-label="Ara"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>

            {/* Wishlist */}
            <Link
              href="/favoriler"
              className="relative p-2.5 text-black/40 hover:text-black transition-colors"
              aria-label="Favoriler"
            >
              <Heart className="w-[18px] h-[18px]" />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-black text-white text-[8px] font-medium rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={openDrawer}
              className="relative p-2.5 text-black/40 hover:text-black transition-colors"
              aria-label="Sepet"
            >
              <ShoppingBag className="w-[18px] h-[18px]" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-gold text-white text-[8px] font-medium rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Editorial discovery drawer */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-[100]">
            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="absolute inset-0 cursor-default bg-black/28 backdrop-blur-[2px]"
              aria-label="Menüyü kapat"
            />
            <motion.aside
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ duration: 0.62, ease }}
              className="absolute inset-y-0 right-0 flex w-full max-w-[620px] flex-col overflow-y-auto bg-[#faf8f5] shadow-[-30px_0_80px_rgba(24,18,10,.16)]"
              aria-label="Keşif menüsü"
            >
              <div className="flex min-h-20 items-center justify-between border-b border-black/8 px-6 md:px-9">
                <div><p className="text-[9px] uppercase tracking-[.24em] text-[#8f7b50]">Novella dünyası</p><p className="mt-1 font-editorial text-2xl">Kendi parçanı keşfet.</p></div>
                <button onClick={() => setMenuOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-black/12 transition-colors hover:bg-black hover:text-white" aria-label="Menüyü kapat"><X className="h-4 w-4" /></button>
              </div>
              <nav className="grid grid-cols-2 gap-3 p-4 md:gap-4 md:p-6">
                {menuCategories.map((category, index) => (
                  <motion.div key={category.href} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: .16 + index * .06, ease }}>
                    <Link href={category.href} onClick={() => setMenuOpen(false)} className="group relative block aspect-[4/5] overflow-hidden bg-[#e6ded2]">
                      <Image src={category.image} alt="" fill sizes="(max-width: 640px) 50vw, 280px" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-white">
                        <div><p className="text-[9px] uppercase tracking-[.18em] text-white/65">{category.note}</p><p className="mt-1 font-editorial text-[clamp(1.35rem,4vw,2rem)] leading-none">{category.label}</p></div>
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="mt-auto border-t border-black/8 px-6 py-6 md:px-9">
                <div className="flex flex-wrap gap-x-6 gap-y-3 text-[11px] text-black/50">
                  {navLinks.slice(2).map((link) => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="hover:text-black">{link.label}</Link>)}
                  <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-black">Instagram</a>
                </div>
                <p className="mt-5 text-[9px] uppercase tracking-[.18em] text-black/28">316L çelik · suya dayanıklı · ulaşılabilir lüks</p>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Cart drawer */}
      <CartDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />

      {/* Search modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
