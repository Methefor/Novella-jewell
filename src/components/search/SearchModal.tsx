/**
 * NOVELLA - Search Modal
 * Gelişmiş arama modal'ı
 */

'use client';

import { useProductSearch } from '@/hooks/useProductSearch';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Clock, Search, TrendingUp, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const popularSearches = [
  'Kolye',
  'Bilezik',
  'Küpe',
  'Yüzük',
  'Altın',
  'Rose Gold',
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const {
    query,
    setQuery,
    results,
    isSearching,
    recentSearches,
    saveSearch,
    clearRecentSearches,
  } = useProductSearch();

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSearchClick = (searchTerm: string) => {
    setQuery(searchTerm);
    saveSearch(searchTerm);
  };

  const handleProductClick = () => {
    saveSearch(query);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-20 px-4"
          >
            <div className="bg-gray-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-4 p-6 border-b border-white/10">
                <Search className="w-6 h-6 text-gold flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ürün, kategori veya özellik ara..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent text-lg text-white placeholder-white/40 outline-none"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-white/60" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(80vh-100px)]">
                {!query ? (
                  <div className="p-6 space-y-6">
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-white/60" />
                            <h3 className="text-sm font-medium text-white/80">
                              Son Aramalar
                            </h3>
                          </div>
                          <button
                            onClick={clearRecentSearches}
                            className="text-xs text-white/40 hover:text-white/60 transition-colors"
                          >
                            Temizle
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((search, index) => (
                            <button
                              key={index}
                              onClick={() => handleSearchClick(search)}
                              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white/80 rounded-full transition-colors"
                            >
                              {search}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Popular Searches */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-gold" />
                        <h3 className="text-sm font-medium text-white/80">
                          Popüler Aramalar
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.map((search) => (
                          <button
                            key={search}
                            onClick={() => handleSearchClick(search)}
                            className="px-3 py-1.5 bg-gold/10 hover:bg-gold/20 border border-gold/30 text-sm text-gold rounded-full transition-colors"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                      <h3 className="text-sm font-medium text-white/80 mb-3">
                        Kategoriler
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { name: 'Kolyeler', href: '/collections/kolye' },
                          { name: 'Bilezikler', href: '/collections/bilezik' },
                          { name: 'Küpeler', href: '/collections/kupe' },
                          { name: 'Yüzükler', href: '/collections/yuzuk' },
                        ].map((category) => (
                          <Link
                            key={category.name}
                            href={category.href}
                            onClick={onClose}
                            className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors group"
                          >
                            <span className="text-sm text-white/80">
                              {category.name}
                            </span>
                            <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-gold transition-colors" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    {/* Loading State */}
                    {isSearching && (
                      <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}

                    {/* Results */}
                    {!isSearching && results.length > 0 && (
                      <div>
                        <p className="text-sm text-white/60 mb-4">
                          {results.length} sonuç bulundu
                        </p>
                        <div className="space-y-3">
                          {results.slice(0, 6).map((product) => (
                            <Link
                              key={product.id}
                              href={`/products/${product.slug}`}
                              onClick={handleProductClick}
                              className="flex items-center gap-4 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors group"
                            >
                              {/* Image */}
                              <div className="relative w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                  src={product.variants[0].images[0]}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                              </div>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-white mb-1 truncate group-hover:text-gold transition-colors">
                                  {product.name}
                                </h4>
                                <p className="text-xs text-white/60 uppercase">
                                  {product.category}
                                </p>
                              </div>

                              {/* Price */}
                              <div className="text-right flex-shrink-0">
                                <p className="text-sm font-semibold text-gold">
                                  {product.price}₺
                                </p>
                                {product.originalPrice && (
                                  <p className="text-xs text-white/40 line-through">
                                    {product.originalPrice}₺
                                  </p>
                                )}
                              </div>
                            </Link>
                          ))}

                          {results.length > 6 && (
                            <Link
                              href={`/collections?search=${encodeURIComponent(
                                query
                              )}`}
                              onClick={handleProductClick}
                              className="block text-center py-3 text-sm text-gold hover:text-gold-light transition-colors"
                            >
                              Tüm {results.length} sonucu gör →
                            </Link>
                          )}
                        </div>
                      </div>
                    )}

                    {/* No Results */}
                    {!isSearching && results.length === 0 && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                          <Search className="w-8 h-8 text-white/40" />
                        </div>
                        <p className="text-white/60 mb-2">Sonuç bulunamadı</p>
                        <p className="text-sm text-white/40">
                          "{query}" için sonuç bulunamadı
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
