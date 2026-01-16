'use client';

import { useCart } from '@/lib/cart';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Menu, Search, ShoppingCart, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const navLinks = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/products', label: 'Tüm Ürünler' },
  { href: '#collections', label: 'Koleksiyonlar' },
  { href: '#about', label: 'Hakkımızda' },
  { href: '#newsletter', label: 'İletişim' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { items, toggleCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          isScrolled ? 'glass py-3' : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left - Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="flex flex-shrink-0 items-center gap-3"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-gradient shadow-lg shadow-gold/30"
              >
                <span className="font-cormorant text-2xl font-bold text-black">
                  N
                </span>
              </motion.div>

              <div className="flex flex-col">
                <h1 className="font-cormorant text-2xl font-bold tracking-tight text-white">
                  NOVELLA
                </h1>
                <p className="font-inter text-[10px] tracking-widest text-white/60">
                  Her Parça Bir Hikaye
                </p>
              </div>
            </motion.div>

            {/* Center - Navigation */}
            <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex">
              {navLinks.map((link) => {
                const isHashLink = link.href.startsWith('#');
                return isHashLink ? (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.querySelector(link.href);
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="font-inter text-sm font-medium text-white/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </motion.a>
                ) : (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="font-inter text-sm font-medium text-white/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </motion.a>
                );
              })}
            </nav>

            {/* Right - Action Icons */}
            <div className="flex flex-1 items-center justify-end gap-4">
              <motion.a
                href="/search"
                whileHover={{ scale: 1.15, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                className="hidden rounded-full bg-white/10 p-2.5 text-white/90 transition-all hover:bg-white/20 hover:text-white lg:block"
                title="Ara"
              >
                <Search className="h-5 w-5" />
              </motion.a>

              <motion.a
                href="/wishlist"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="hidden rounded-full bg-white/10 p-2.5 text-white/90 transition-all hover:bg-white/20 hover:text-white lg:block"
                title="Favoriler"
              >
                <Heart className="h-5 w-5" />
              </motion.a>

              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleCart}
                className="relative rounded-full bg-white/10 p-2.5 text-white/90 transition-all hover:bg-white/20 hover:text-white"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-xs font-bold text-black shadow-lg"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-full bg-white/10 p-2.5 text-white lg:hidden"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween' }}
            className="glass-strong fixed inset-y-0 right-0 z-50 w-full max-w-sm"
          >
            <div className="flex h-full flex-col p-8">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="font-cormorant text-2xl font-bold text-white">
                  Menü
                </h2>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>

              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => {
                  const isHashLink = link.href.startsWith('#');
                  return (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => {
                        if (isHashLink) {
                          e.preventDefault();
                          const element = document.querySelector(link.href);
                          element?.scrollIntoView({ behavior: 'smooth' });
                        }
                        setMobileMenuOpen(false);
                      }}
                      whileHover={{ x: 10 }}
                      className="font-inter text-lg font-medium text-white/80 transition-colors hover:text-white"
                    >
                      {link.label}
                    </motion.a>
                  );
                })}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
