'use client';

import CartDrawer from '@/components/cart/CartDrawer';
import SearchModal from '@/components/search/SearchModal';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import { Heart, Plus, Search, ShoppingBag, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const ease = [0.16, 1, 0.3, 1] as const;

const navLinks = [
  { label: 'Koleksiyonlar', href: '/collections' },
  { label: 'Yeni Gelenler', href: '/collections/yeni-gelenler' },
  { label: 'Hikayemiz', href: '/hikayemiz' },
  { label: 'İletişim', href: '/#iletisim' },
];

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
              className="font-serif text-[22px] font-medium tracking-tight text-black leading-none"
            >
              NOVELLA
            </Link>

            {/* Menu pill */}
            <button
              onClick={() => setMenuOpen(true)}
              className="flex items-center gap-2 px-3 py-[7px] bg-black rounded-full text-white hover:bg-accent transition-colors duration-300"
              aria-label="Menüyü aç"
            >
              <span className="w-[18px] h-[18px] rounded-full bg-white flex items-center justify-center flex-shrink-0">
                <Plus className="w-[9px] h-[9px] text-black stroke-[2.5]" />
              </span>
              <span className="text-[11px] font-sans font-light leading-none pr-0.5">
                Menü
              </span>
            </button>

            {/* Feature pills — desktop only */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-[7px] bg-[#F4F4F6] rounded-full">
              <span className="text-[11px] font-sans font-light text-black/60">
                316L Çelik
              </span>
              <span className="text-black/20 text-[10px]">·</span>
              <span className="text-[11px] font-sans font-light text-black/60">
                El Seçimi
              </span>
            </div>
          </div>

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

      {/* Full-screen menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed inset-0 z-[100] bg-white flex flex-col"
          >
            {/* Top bar */}
            <div
              style={{ height: 'var(--navbar-h)' }}
              className="flex items-center justify-between px-6 md:px-10 border-b border-black/5 flex-shrink-0"
            >
              <span className="font-serif text-[22px] font-medium tracking-tight">
                NOVELLA
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 text-black/40 hover:text-black transition-colors"
                aria-label="Menüyü kapat"
              >
                <X className="w-[18px] h-[18px]" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col justify-center flex-1 px-6 md:px-10 gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 + i * 0.06, ease }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="group block py-3 font-serif font-light text-black hover:text-accent transition-colors duration-300"
                    style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}
                  >
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">
                      {link.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Bottom bar */}
            <div className="px-6 md:px-10 py-6 border-t border-black/5 flex items-center justify-between flex-shrink-0">
              <span className="text-[11px] font-sans text-black/30">
                © {new Date().getFullYear()} Novella
              </span>
              <div className="flex items-center gap-5 text-[11px] font-sans text-black/35">
                <a
                  href="https://www.instagram.com/jewelry.novella/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="https://api.whatsapp.com/send?phone=905451125059"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart drawer */}
      <CartDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />

      {/* Search modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
