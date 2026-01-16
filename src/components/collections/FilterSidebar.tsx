/**
 * NOVELLA - Filter Sidebar Component
 * Ürün filtreleme sidebar'ı
 */

'use client';

import { selectActiveFiltersCount, useFilterStore } from '@/store/filterStore';
import type {
  ProductCategory,
  ProductColor,
  ProductMaterial,
} from '@/types/product';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useState } from 'react';

// Kategori labels
const categoryLabels: Record<ProductCategory, string> = {
  kolye: 'Kolye',
  bilezik: 'Bilezik',
  kupe: 'Küpe',
  yuzuk: 'Yüzük',
};

// Malzeme labels
const materialLabels: Record<ProductMaterial, string> = {
  celik: 'Çelik',
  'gumus-kaplama': 'Gümüş-kaplama',
  'altin-kaplama': 'Altın Kaplama',
  'rose-gold-kaplama': 'Rose Gold',
};

// Renk labels ve hex değerleri
const colorOptions: Record<ProductColor, { label: string; hex: string }> = {
  altin: { label: 'Altın', hex: '#D4AF37' },
  gumus: { label: 'Gümüş', hex: '#C0C0C0' },
  'rose-gold': { label: 'Rose Gold', hex: '#B76E79' },
  siyah: { label: 'Siyah', hex: '#0F0F0F' },
  beyaz: { label: 'Beyaz', hex: '#FFFFFF' },
  'cok-renkli': {
    label: 'Çok Renkli',
    hex: 'linear-gradient(135deg, #D4AF37, #B76E79, #C0C0C0)',
  },
};

interface FilterSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FilterSection({
  title,
  isOpen,
  onToggle,
  children,
}: FilterSectionProps) {
  return (
    <div className="border-b border-cream-200 py-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left"
        aria-expanded={isOpen}
      >
        <h3 className="font-serif text-lg text-black">{title}</h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gold" />
        ) : (
          <ChevronDown className="w-5 h-5 text-black/40" />
        )}
      </button>

      {isOpen && <div className="mt-4 space-y-3">{children}</div>}
    </div>
  );
}

export default function FilterSidebar() {
  const filterStore = useFilterStore();
  const activeFiltersCount = useFilterStore(selectActiveFiltersCount);

  // Accordion state
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    material: false,
    color: false,
    features: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <aside className="w-full lg:w-64 xl:w-72">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl text-black">Filtrele</h2>
        {activeFiltersCount > 0 && (
          <button
            onClick={filterStore.resetFilters}
            className="flex items-center gap-1 text-sm text-gold hover:text-gold/80 transition-colors"
          >
            <X className="w-4 h-4" />
            Temizle ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Kategori */}
      <FilterSection
        title="Kategori"
        isOpen={openSections.category}
        onToggle={() => toggleSection('category')}
      >
        <div className="space-y-2">
          {(Object.keys(categoryLabels) as ProductCategory[]).map(
            (category) => (
              <label
                key={category}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filterStore.categories.includes(category)}
                  onChange={() => filterStore.toggleCategory(category)}
                  className="w-4 h-4 rounded border-cream-300 text-gold focus:ring-gold focus:ring-offset-0"
                />
                <span className="text-sm text-black/80 group-hover:text-black transition-colors">
                  {categoryLabels[category]}
                </span>
              </label>
            )
          )}
        </div>
      </FilterSection>

      {/* Fiyat Aralığı */}
      <FilterSection
        title="Fiyat"
        isOpen={openSections.price}
        onToggle={() => toggleSection('price')}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={filterStore.priceRange.min}
              onChange={(e) =>
                filterStore.setPriceRange(
                  Number(e.target.value),
                  filterStore.priceRange.max
                )
              }
              placeholder="Min"
              className="w-full px-3 py-2 text-sm border border-cream-300 rounded-md focus:border-gold focus:ring-1 focus:ring-gold"
            />
            <span className="text-black/40">-</span>
            <input
              type="number"
              value={filterStore.priceRange.max}
              onChange={(e) =>
                filterStore.setPriceRange(
                  filterStore.priceRange.min,
                  Number(e.target.value)
                )
              }
              placeholder="Max"
              className="w-full px-3 py-2 text-sm border border-cream-300 rounded-md focus:border-gold focus:ring-1 focus:ring-gold"
            />
          </div>

          {/* Slider alternatif */}
          <input
            type="range"
            min="0"
            max="1000"
            step="50"
            value={filterStore.priceRange.max}
            onChange={(e) =>
              filterStore.setPriceRange(
                filterStore.priceRange.min,
                Number(e.target.value)
              )
            }
            className="w-full accent-gold"
          />

          <div className="text-xs text-black/60 text-center">
            {filterStore.priceRange.min}₺ - {filterStore.priceRange.max}₺
          </div>
        </div>
      </FilterSection>

      {/* Malzeme */}
      <FilterSection
        title="Malzeme"
        isOpen={openSections.material}
        onToggle={() => toggleSection('material')}
      >
        <div className="space-y-2">
          {(Object.keys(materialLabels) as ProductMaterial[]).map(
            (material) => (
              <label
                key={material}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filterStore.materials.includes(material)}
                  onChange={() => filterStore.toggleMaterial(material)}
                  className="w-4 h-4 rounded border-cream-300 text-gold focus:ring-gold focus:ring-offset-0"
                />
                <span className="text-sm text-black/80 group-hover:text-black transition-colors">
                  {materialLabels[material]}
                </span>
              </label>
            )
          )}
        </div>
      </FilterSection>

      {/* Renk */}
      <FilterSection
        title="Renk"
        isOpen={openSections.color}
        onToggle={() => toggleSection('color')}
      >
        <div className="grid grid-cols-3 gap-3">
          {(Object.keys(colorOptions) as ProductColor[]).map((color) => {
            const option = colorOptions[color];
            const isSelected = filterStore.colors.includes(color);

            return (
              <button
                key={color}
                onClick={() => filterStore.toggleColor(color)}
                className={`
                  relative group flex flex-col items-center gap-2 p-2 rounded-lg border-2 transition-all
                  ${
                    isSelected
                      ? 'border-gold bg-gold/5'
                      : 'border-cream-200 hover:border-gold/40'
                  }
                `}
                title={option.label}
              >
                {/* Color swatch */}
                <div
                  className={`
                    w-8 h-8 rounded-full border-2 transition-transform
                    ${isSelected ? 'scale-110 border-gold' : 'border-cream-300'}
                  `}
                  style={{
                    background: option.hex.includes('gradient')
                      ? option.hex
                      : option.hex,
                    ...(color === 'beyaz' && { borderWidth: '2px' }),
                  }}
                />

                {/* Label */}
                <span className="text-xs text-black/70 text-center leading-tight">
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Özel Özellikler */}
      <FilterSection
        title="Özellikler"
        isOpen={openSections.features}
        onToggle={() => toggleSection('features')}
      >
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={filterStore.isNew}
              onChange={(e) => filterStore.setIsNew(e.target.checked)}
              className="w-4 h-4 rounded border-cream-300 text-gold focus:ring-gold focus:ring-offset-0"
            />
            <span className="text-sm text-black/80 group-hover:text-black transition-colors">
              Yeni Ürünler
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={filterStore.isBestSeller}
              onChange={(e) => filterStore.setIsBestSeller(e.target.checked)}
              className="w-4 h-4 rounded border-cream-300 text-gold focus:ring-gold focus:ring-offset-0"
            />
            <span className="text-sm text-black/80 group-hover:text-black transition-colors">
              Çok Satanlar
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={filterStore.isCustomizable}
              onChange={(e) => filterStore.setIsCustomizable(e.target.checked)}
              className="w-4 h-4 rounded border-cream-300 text-gold focus:ring-gold focus:ring-offset-0"
            />
            <span className="text-sm text-black/80 group-hover:text-black transition-colors">
              İsim Baskısı
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={filterStore.inStock}
              onChange={(e) => filterStore.setInStock(e.target.checked)}
              className="w-4 h-4 rounded border-cream-300 text-gold focus:ring-gold focus:ring-offset-0"
            />
            <span className="text-sm text-black/80 group-hover:text-black transition-colors">
              Stokta Var
            </span>
          </label>
        </div>
      </FilterSection>
    </aside>
  );
}
