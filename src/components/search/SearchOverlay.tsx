/**
 * NOVELLA - Premium Search Overlay
 * Anime.js ile güçlendirilmiş tam ekran arama arayüzü
 */

'use client';

import { useProductSearch } from '@/hooks/useProductSearch';
import * as animeNamespace from 'animejs';
import { ArrowRight, Clock, Search, TrendingUp, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

const anime = (animeNamespace as any).default || animeNamespace;

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const popularSearches = [
  'Kolye',
  'Bilezik',
  'Küpe',
  'Yüzük',
  'Çelik Takı',
  'Rose Gold',
];

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const {
    query,
    setQuery,
    results,
    isSearching,
    recentSearches,
    saveSearch,
    clearRecentSearches,
  } = useProductSearch();

  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Opening / Closing Animations
  useEffect(() => {
    if (isOpen) {
      // Focus input
      setTimeout(() => inputRef.current?.focus(), 500);
      document.body.style.overflow = 'hidden';

      // Animate Overlay In
      if (overlayRef.current) {
        anime({
          targets: overlayRef.current,
          opacity: [0, 1],
          duration: 400,
          easing: 'easeOutQuad',
        });
      }

      // Animate Content In
      if (contentRef.current) {
        anime({
          targets: contentRef.current,
          translateY: [20, 0],
          opacity: [0, 1],
          duration: 600,
          delay: 100,
          easing: 'easeOutCubic',
        });
      }
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  const handleClose = () => {
    if (overlayRef.current) {
      anime({
        targets: overlayRef.current,
        opacity: 0,
        duration: 300,
        easing: 'easeInQuad',
        complete: () => onClose(),
      });
    } else {
      onClose();
    }
  };

  const handleSearchClick = (searchTerm: string) => {
    setQuery(searchTerm);
    saveSearch(searchTerm);
  };

  const handleProductClick = () => {
    saveSearch(query);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-xl"
      style={{ opacity: 0 }}
    >
      {/* Header Area */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-gradient shadow-lg">
              <span className="font-cormorant text-xl font-bold text-black">N</span>
            </div>
            <h2 className="font-cormorant text-2xl font-bold tracking-tight text-white">
              ARAMA
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white/60 transition-all hover:bg-white/10 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Main Search Area */}
      <div ref={contentRef} className="container mx-auto flex-1 px-6 pb-20">
        <div className="mx-auto max-w-4xl pt-10">
          {/* Input Box */}
          <div className="group relative mb-12">
            <Search className="absolute left-6 top-1/2 h-8 w-8 -translate-y-1/2 text-gold transition-transform group-focus-within:scale-110" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Ürün, kategori veya özellik ara..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-20 w-full rounded-2xl bg-white/5 pl-20 pr-8 font-inter text-2xl text-white placeholder-white/20 outline-none ring-1 ring-white/10 transition-all focus:bg-white/10 focus:ring-gold/50"
            />
          </div>

          {!query ? (
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-white/40" />
                      <h3 className="text-sm font-semibold uppercase tracking-widest text-white/60">
                        Son Aramalar
                      </h3>
                    </div>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-white/30 hover:text-white/60"
                    >
                      Temizle
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSearchClick(search)}
                        className="rounded-full bg-white/5 px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/15"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-gold" />
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-white/60">
                    Önerilenler
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => handleSearchClick(search)}
                      className="rounded-full bg-gold/10 px-4 py-2 text-sm text-gold transition-colors hover:bg-gold/20"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Categories */}
              <div className="space-y-6">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-white/60">
                  Hızlı Kategoriler
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { name: 'Kolyeler', href: '/categories/kolye' },
                    { name: 'Bilezikler', href: '/categories/bilezik' },
                    { name: 'Küpeler', href: '/categories/kupe' },
                    { name: 'Yüzükler', href: '/categories/yuzuk' },
                  ].map((category) => (
                    <Link
                      key={category.name}
                      href={category.href}
                      onClick={handleClose}
                      className="flex items-center justify-between rounded-xl bg-white/5 p-4 transition-all hover:bg-white/10 group"
                    >
                      <span className="text-white/80">{category.name}</span>
                      <ArrowRight className="h-4 w-4 text-white/20 transition-transform group-hover:translate-x-1 group-hover:text-gold" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div ref={resultsRef}>
              {isSearching ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="h-12 w-12 animate-spin rounded-full border-2 border-gold border-t-transparent" />
                  <p className="mt-4 font-inter text-white/40">Sonuçlar getiriliyor...</p>
                </div>
              ) : results.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {results.slice(0, 4).map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={handleProductClick}
                      className="flex items-center gap-6 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 transition-all hover:bg-white/10 hover:ring-gold/30 group"
                    >
                      <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-gray-800">
                        {product.images?.[0] && (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="96px"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-inter text-lg font-medium text-white group-hover:text-gold transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-sm text-white/40">{product.category}</p>
                        <div className="mt-2 text-xl font-bold text-gold">
                          {product.price}₺
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
                    <Search className="h-10 w-10 text-white/20" />
                  </div>
                  <h3 className="text-xl font-medium text-white/80">Sonuç bulunamadı</h3>
                  <p className="mt-2 text-white/40">
                    "{query}" aramasıyla eşleşen bir ürün bulamadık.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
