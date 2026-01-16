/**
 * NOVELLA - Collections Page
 * Luxury Cream Theme
 */

'use client';

import AdvancedFilterSidebar from '@/components/filters/AdvancedFilterSidebar';
import ProductCard from '@/components/product/ProductCard';
import { getAllProducts } from '@/data/products';
import { useProductFilters } from '@/hooks/useProductFilters';
import { Grid3x3, LayoutGrid, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

export default function CollectionsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid-3' | 'grid-4'>('grid-4');

  const allProducts = getAllProducts();
  const { filteredProducts, filters, updateFilters, resetFilters } =
    useProductFilters(allProducts);

  const activeFiltersCount =
    (filters.categories?.length || 0) +
    (filters.materials?.length || 0) +
    (filters.colors?.length || 0) +
    (filters.features?.length || 0) +
    (filters.priceRange ? 1 : 0);

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-cream border-b border-gray-200">
        <div className="container-custom py-16">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-widest text-gold font-medium mb-3">
              Koleksiyonlar
            </p>
            <h1 className="font-serif text-5xl md:text-6xl text-gray-900 mb-4">
              Tüm Ürünlerimiz
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Özenle seçilmiş, butik takı koleksiyonumuzu keşfedin. Her parça,
              kalite ve zarafeti bir araya getiriyor.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-custom py-12">
        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <AdvancedFilterSidebar
                filters={filters}
                onFilterChange={updateFilters}
                onReset={resetFilters}
                productCount={filteredProducts.length}
              />
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden btn btn-secondary relative"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  <span>Filtreler</span>
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-gold text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* Results Count */}
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">
                    {filteredProducts.length}
                  </span>{' '}
                  ürün bulundu
                </p>
              </div>

              {/* View Mode */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid-3')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid-3'
                      ? 'bg-gold text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('grid-4')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid-4'
                      ? 'bg-gold text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  Aktif Filtreler:
                </span>
                {filters.categories?.map((category) => (
                  <button
                    key={category}
                    onClick={() =>
                      updateFilters({
                        categories: filters.categories?.filter(
                          (c) => c !== category
                        ),
                      })
                    }
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-gold transition-all"
                  >
                    {category}
                    <X className="w-3 h-3" />
                  </button>
                ))}
                {filters.materials?.map((material) => (
                  <button
                    key={material}
                    onClick={() =>
                      updateFilters({
                        materials: filters.materials?.filter(
                          (m) => m !== material
                        ),
                      })
                    }
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-gold transition-all"
                  >
                    {material}
                    <X className="w-3 h-3" />
                  </button>
                ))}
                {filters.colors?.map((color) => (
                  <button
                    key={color}
                    onClick={() =>
                      updateFilters({
                        colors: filters.colors?.filter((c) => c !== color),
                      })
                    }
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-gold transition-all"
                  >
                    {color}
                    <X className="w-3 h-3" />
                  </button>
                ))}
                {filters.priceRange && (
                  <button
                    onClick={() => updateFilters({ priceRange: undefined })}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-gold transition-all"
                  >
                    {filters.priceRange[0]}₺ - {filters.priceRange[1]}₺
                    <X className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={resetFilters}
                  className="text-sm text-gold hover:text-gold-dark font-medium transition-colors"
                >
                  Tümünü Temizle
                </button>
              </div>
            )}

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div
                className={`grid gap-6 ${
                  viewMode === 'grid-3'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                }`}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <SlidersHorizontal className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="font-serif text-2xl text-gray-900 mb-3">
                  Ürün Bulunamadı
                </h3>
                <p className="text-gray-600 mb-6">
                  Aradığınız kriterlere uygun ürün bulunamadı. Filtreleri
                  değiştirmeyi deneyin.
                </p>
                <button onClick={resetFilters} className="btn btn-primary">
                  Filtreleri Sıfırla
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="font-serif text-2xl text-gray-900">Filtreler</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <AdvancedFilterSidebar
                filters={filters}
                onFilterChange={updateFilters}
                onReset={resetFilters}
                productCount={filteredProducts.length}
              />
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="btn btn-primary w-full"
              >
                Ürünleri Göster ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
