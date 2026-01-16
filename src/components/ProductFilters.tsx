'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface FilterOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'oldest' | 'name-asc';
  featured?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
}

interface ProductFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  categories: string[];
}

export default function ProductFilters({
  filters,
  onFiltersChange,
  categories,
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      }
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value === '' ? undefined : value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined);

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass mb-4 flex w-full items-center justify-between rounded-lg p-4 lg:hidden"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-white" />
          <span className="font-inter font-semibold text-white">Filtrele</span>
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold text-xs font-bold text-black">
              {Object.values(filters).filter((v) => v !== undefined).length}
            </span>
          )}
        </div>
        <span className="text-white/60">▼</span>
      </button>

      {/* Filter Panel */}
      <AnimatePresence>
        {(isOpen || isDesktop) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass mb-6 rounded-2xl p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-cormorant text-xl font-semibold text-white">
                Filtrele
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 font-inter text-sm text-white/60 transition-colors hover:text-white"
                >
                  <X className="h-4 w-4" />
                  Temizle
                </button>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Category Filter */}
              <div>
                <label className="mb-2 block font-inter text-sm font-medium text-white/80">
                  Kategori
                </label>
                <select
                  value={filters.category || ''}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="glass w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 font-inter text-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                >
                  <option value="">Tümü</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="mb-2 block font-inter text-sm font-medium text-white/80">
                  Min Fiyat (₺)
                </label>
                <input
                  type="number"
                  value={filters.minPrice || ''}
                  onChange={(e) =>
                    handleFilterChange('minPrice', Number(e.target.value))
                  }
                  placeholder="0"
                  className="glass w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 font-inter text-white placeholder:text-white/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
              </div>

              <div>
                <label className="mb-2 block font-inter text-sm font-medium text-white/80">
                  Max Fiyat (₺)
                </label>
                <input
                  type="number"
                  value={filters.maxPrice || ''}
                  onChange={(e) =>
                    handleFilterChange('maxPrice', Number(e.target.value))
                  }
                  placeholder="10000"
                  className="glass w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 font-inter text-white placeholder:text-white/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
              </div>

              {/* Sort By */}
              <div>
                <label className="mb-2 block font-inter text-sm font-medium text-white/80">
                  Sırala
                </label>
                <select
                  value={filters.sortBy || ''}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="glass w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 font-inter text-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                >
                  <option value="">Varsayılan</option>
                  <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
                  <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
                  <option value="newest">En Yeni</option>
                  <option value="oldest">En Eski</option>
                  <option value="name-asc">İsme Göre (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Badge Filters */}
            <div className="mt-6 flex flex-wrap gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.featured || false}
                  onChange={(e) => handleFilterChange('featured', e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 text-gold focus:ring-gold"
                />
                <span className="font-inter text-sm text-white/80">Öne Çıkan</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.isBestSeller || false}
                  onChange={(e) => handleFilterChange('isBestSeller', e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 text-gold focus:ring-gold"
                />
                <span className="font-inter text-sm text-white/80">Çok Satan</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.isNew || false}
                  onChange={(e) => handleFilterChange('isNew', e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 text-gold focus:ring-gold"
                />
                <span className="font-inter text-sm text-white/80">Yeni Ürün</span>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

