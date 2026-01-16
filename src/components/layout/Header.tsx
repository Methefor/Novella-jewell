/**
 * NOVELLA - Header Component
 * Luxury Cream Theme
 */

'use client';

import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import SearchModal from '../search/SearchModal';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const cartItemsCount = useCartStore((state) => state.items.length);
  const wishlistItemsCount = useWishlistStore((state) => state.items.length);

  const navigation = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Koleksiyonlar', href: '/collections' },
    { name: 'Yeni Gelenler', href: '/collections/yeni-gelenler' },
    { name: 'Hakkımızda', href: '/about' },
    { name: 'İletişim', href: '/contact' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E8E5E0] shadow-sm">
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <span className="font-serif text-3xl font-semibold text-[#1A1A1A] tracking-wide transition-colors group-hover:text-[#C9A86A]">
                NOVELLA
              </span>
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
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <nav className="lg:hidden py-6 border-t border-[#E8E5E0] animate-fadeIn">
              <div className="flex flex-col gap-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-base font-medium text-[#6B6B6B] hover:text-[#C9A86A] transition-colors py-2 uppercase tracking-wide"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
