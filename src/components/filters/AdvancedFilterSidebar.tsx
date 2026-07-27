'use client';

import type { ProductFilters } from '@/hooks/useProductFilters';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import PriceRangeSlider from './PriceRangeSlider';

interface AdvancedFilterSidebarProps {
  filters: ProductFilters;
  onFilterChange: (filters: Partial<ProductFilters>) => void;
  onReset: () => void;
  productCount: number;
}

const categories = [
  { value: 'bilezik', label: 'Bileklik' },
  { value: 'kupe', label: 'Küpe' },
  { value: 'yuzuk', label: 'Yüzük' },
];
const materials = [
  { value: 'celik', label: '316L Çelik' },
  { value: 'gumus-kaplama', label: 'Gümüş Kaplama' },
  { value: 'altin-kaplama', label: 'Altın Kaplama' },
  { value: 'rose-gold-kaplama', label: 'Rose Gold Kaplama' },
];
const colors = [
  { value: 'altin', label: 'Altın' },
  { value: 'gumus', label: 'Gümüş' },
  { value: 'rose-gold', label: 'Rose Gold' },
  { value: 'siyah', label: 'Siyah' },
  { value: 'beyaz', label: 'Beyaz' },
  { value: 'cok-renkli', label: 'Çok Renkli' },
];

export default function AdvancedFilterSidebar({
  filters,
  onFilterChange,
  onReset,
  productCount,
}: AdvancedFilterSidebarProps) {
  const [openSections, setOpenSections] = useState<string[]>([
    'category',
    'material',
    'price',
  ]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const FilterSection = ({
    title,
    sectionKey,
    children,
  }: {
    title: string;
    sectionKey: string;
    children: React.ReactNode;
  }) => {
    const isOpen = openSections.includes(sectionKey);

    return (
      <div className="border-b border-gray-200 last:border-0">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between py-4 text-left"
        >
          <span className="font-semibold text-gray-900">{title}</span>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        {isOpen && <div className="pb-4">{children}</div>}
      </div>
    );
  };

  const onCategoryToggle = (category: string) => {
    const currentCategories = filters.categories || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter((c) => c !== category)
      : [...currentCategories, category];
    onFilterChange({ categories: newCategories });
  };

  const onMaterialToggle = (material: string) => {
    const currentMaterials = filters.materials || [];
    const newMaterials = currentMaterials.includes(material)
      ? currentMaterials.filter((m) => m !== material)
      : [...currentMaterials, material];
    onFilterChange({ materials: newMaterials });
  };

  const onColorToggle = (color: string) => {
    const currentColors = filters.colors || [];
    const newColors = currentColors.includes(color)
      ? currentColors.filter((c) => c !== color)
      : [...currentColors, color];
    onFilterChange({ colors: newColors });
  };

  const onPriceChange = (range: [number, number]) => {
    onFilterChange({ priceRange: range });
  };

  const priceRange = { min: 0, max: 10000 };
  const currentPriceRange = filters.priceRange || [
    priceRange.min,
    priceRange.max,
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl text-gray-900">Filtreler</h2>
        <button
          onClick={onReset}
          className="text-sm text-gold hover:text-gold-dark font-medium transition-colors"
        >
          Temizle
        </button>
      </div>

      <div className="space-y-0">
        <FilterSection title="Kategori" sectionKey="category">
          <div className="space-y-2">
            {categories.map((category) => (
              <label
                key={category.value}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.categories?.includes(category.value) || false}
                  onChange={() => onCategoryToggle(category.value)}
                  className="checkbox"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {category.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Malzeme" sectionKey="material">
          <div className="space-y-2">
            {materials.map((material) => (
              <label
                key={material.value}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.materials?.includes(material.value) || false}
                  onChange={() => onMaterialToggle(material.value)}
                  className="checkbox"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {material.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Fiyat Aralığı" sectionKey="price">
          <PriceRangeSlider
            min={priceRange.min}
            max={priceRange.max}
            value={{ min: currentPriceRange[0], max: currentPriceRange[1] }}
            onChange={(range) => onPriceChange([range.min, range.max])}
          />
        </FilterSection>

        <FilterSection title="Renk" sectionKey="color">
          <div className="space-y-2">
            {colors.map((color) => (
              <label
                key={color.value}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.colors?.includes(color.value) || false}
                  onChange={() => onColorToggle(color.value)}
                  className="checkbox"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {color.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{productCount}</span>{' '}
          ürün bulundu
        </p>
      </div>
    </div>
  );
}
