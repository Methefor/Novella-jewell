'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { searchProducts } from '@/lib/products';
import { Product } from '@/lib/sanity.types';
import ProductGrid from './ProductGrid';

interface SearchResultsProps {
  query: string;
}

export default function SearchResults({ query: initialQuery }: SearchResultsProps) {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!initialQuery);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const products = await searchProducts(query);
      setResults(products);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
    // Update URL without reload
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) {
      params.set('q', searchQuery);
    } else {
      params.delete('q');
    }
    window.history.pushState({}, '', `?${params.toString()}`);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setResults([]);
    setHasSearched(false);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    window.history.pushState({}, '', `?${params.toString()}`);
  };

  return (
    <div>
      {/* Search Bar */}
      <form onSubmit={handleSubmit} className="glass mb-8 rounded-2xl p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ürün, kategori veya açıklama ara..."
            className="w-full rounded-lg border border-white/10 bg-white/5 py-4 pl-14 pr-12 font-inter text-white placeholder:text-white/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </form>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="glass h-[400px] animate-pulse rounded-2xl bg-white/5"
            />
          ))}
        </div>
      ) : hasSearched ? (
        <>
          {results.length > 0 ? (
            <>
              <p className="mb-6 font-inter text-white/60">
                "{searchQuery}" için {results.length} sonuç bulundu
              </p>
              <ProductGrid products={results} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <Search className="mb-4 h-16 w-16 text-white/20" />
              <h3 className="mb-2 font-cormorant text-2xl font-semibold text-white">
                Sonuç Bulunamadı
              </h3>
              <p className="mb-6 font-inter text-white/60">
                "{searchQuery}" için ürün bulunamadı. Farklı bir arama terimi deneyin.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <Search className="mb-4 h-16 w-16 text-white/20" />
          <h3 className="mb-2 font-cormorant text-2xl font-semibold text-white">
            Arama Yapın
          </h3>
          <p className="font-inter text-white/60">
            Ürün adı, kategori veya açıklama ile arama yapabilirsiniz.
          </p>
        </div>
      )}
    </div>
  );
}

