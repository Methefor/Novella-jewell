import { getAllProducts } from '@/lib/products';
import { NovellaProduct } from '@/lib/sanity.types';
import { useCallback, useEffect, useState } from 'react';

const RECENT_SEARCHES_KEY = 'novella-recent-searches';
const MAX_RECENT_SEARCHES = 5;

export function useProductSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NovellaProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load recent searches:', error);
      }
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const performSearch = async () => {
      try {
        const allProducts = await getAllProducts();
        const searchTerm = query.toLowerCase().trim();

        const filtered = allProducts.filter((product) => {
          return (
            product.name.toLowerCase().includes(searchTerm) ||
            (product.description && product.description.toLowerCase().includes(searchTerm)) ||
            (product.category && product.category.toLowerCase().includes(searchTerm)) ||
            (product.features && product.features.some((feature) =>
              feature.toLowerCase().includes(searchTerm)
            ))
          );
        });

        setResults(filtered);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(performSearch, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Save search to recent
  const saveSearch = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return;

    setRecentSearches((prev) => {
      const newSearches = [
        searchTerm,
        ...prev.filter((s) => s !== searchTerm),
      ].slice(0, MAX_RECENT_SEARCHES);

      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(newSearches));
      return newSearches;
    });
  }, []);

  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  }, []);

  return {
    query,
    setQuery,
    results,
    isSearching,
    recentSearches,
    saveSearch,
    clearRecentSearches,
  };
}
