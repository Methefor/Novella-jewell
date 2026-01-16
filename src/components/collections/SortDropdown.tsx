/**
 * NOVELLA - Sort Dropdown Component
 * Ürün sıralama dropdown'ı
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { useFilterStore } from '@/store/filterStore';
import { ChevronDown, Check } from 'lucide-react';
import type { SortOption } from '@/types/product';

const sortOptions: Record<SortOption, string> = {
  'newest': 'En Yeni',
  'popular': 'En Popüler',
  'price-asc': 'Fiyat: Düşükten Yükseğe',
  'price-desc': 'Fiyat: Yüksekten Düşüğe',
  'name-asc': 'İsim: A-Z',
  'name-desc': 'İsim: Z-A',
};

export default function SortDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const sortBy = useFilterStore((state) => state.sortBy);
  const setSortBy = useFilterStore((state) => state.setSortBy);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: SortOption) => {
    setSortBy(option);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-2 px-4 py-2.5 
          bg-white border border-cream-300 rounded-lg
          text-sm text-black/80
          hover:border-gold/40 hover:bg-cream/20
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-gold/20
        "
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="font-medium">Sırala:</span>
        <span>{sortOptions[sortBy]}</span>
        <ChevronDown 
          className={`w-4 h-4 text-gold transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="
            absolute right-0 mt-2 w-64
            bg-white border border-cream-200 rounded-lg shadow-lg
            overflow-hidden
            z-50
            animate-in fade-in slide-in-from-top-2 duration-200
          "
          role="listbox"
        >
          {(Object.keys(sortOptions) as SortOption[]).map((option) => {
            const isSelected = sortBy === option;
            
            return (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={`
                  w-full flex items-center justify-between px-4 py-3
                  text-sm text-left
                  transition-colors duration-150
                  ${isSelected 
                    ? 'bg-gold/10 text-gold font-medium' 
                    : 'text-black/80 hover:bg-cream/50'
                  }
                `}
                role="option"
                aria-selected={isSelected}
              >
                <span>{sortOptions[option]}</span>
                {isSelected && (
                  <Check className="w-4 h-4 text-gold" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
