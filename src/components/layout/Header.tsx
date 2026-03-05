/**
 * NOVELLA - Header Component
 * Luxury Cream Theme + Scroll Animations
 */

'use client';

import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import SearchModal from '../search/SearchModal';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartItemsCount = useCartStore((state) => state.items.length);
  const wishlistItemsCount = useWishlistStore((state) => state.items.length);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 60);
  });

  const navigation = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Koleksiyonlar', href: '/collections' },
    { name: 'Yeni Gelenler', href: '/collections/yeni-gelenler' },
    { name: 'Hakkımızda', href: '/#about' },
    { name: 'İletişim', href: '/#contact' },
  ];

  return (
    <>
      <motion.header
        animate={{
          boxShadow: scrolled
            ? '0 4px 24px rgba(0,0,0,0.08)'
            : '0 1px 0px rgba(0,0,0,0.04)',
        }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E8E5E0]"
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <motion.span
                animate={{ color: scrolled ? '#C9A86A' : '#1A1A1A' }}
                transition={{ duration: 0.4 }}
                className="font-serif text-3xl font-semibold tracking-wide"
              >
                NOVELLA
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-[#6B6B6B] hover:text-[#C9A86A] transition-colors uppercase tracking-wider"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-[#6B6B6B] hover:text-[#C9A86A] transition-colors"
                aria-label="Ara"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 text-[#6B6B6B] hover:text-[#C9A86A] transition-colors"
                aria-label="Favoriler"
              >
                <Heart className="w-5 h-5" />
                {wishlistItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C9A86A] text-white text-xs font-semibold rounded-full flex items-center justify-center">
                    {wishlistItemsCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 text-[#6B6B6B] hover:text-[#C9A86A] transition-colors"
                aria-label="Sepet"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C9A86A] text-white text-xs font-semibold rounded-full flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-[#6B6B6B] hover:text-[#C9A86A] transition-colors"
                aria-label="Menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.nav
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="lg:hidden border-t border-[#E8E5E0] overflow-hidden"
              >
                <div className="flex flex-col gap-4 py-6">
                  {navigation.map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ x: -16, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="block text-base font-medium text-[#6B6B6B] hover:text-[#C9A86A] transition-colors py-2 uppercase tracking-wide"
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
