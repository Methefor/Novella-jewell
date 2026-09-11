'use client';

import ProductCard from '@/components/product/ProductCard';
import type { Collection } from '@/data/collections';
import type { Product, ProductCategory } from '@/types/product';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';



const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'bilezik', label: 'Bileklik' },
  { value: 'kupe', label: 'Küpe' },
  { value: 'yuzuk', label: 'Yüzük' },
];

const PRICE_RANGES = [
  { label: 'Tümü', min: 0, max: Infinity },
  { label: '349–449 ₺', min: 349, max: 449 },
  { label: '499–649 ₺', min: 499, max: 649 },
  { label: '699 ₺ +', min: 699, max: Infinity },
];

interface Props {
  collection: Collection;
  products: Product[];
}

function parsePriceParam(fiyat: string | null) {
  if (!fiyat) return { min: 0, max: Infinity };
  const parts = fiyat.split('-');
  return {
    min: parseInt(parts[0] ?? '0') || 0,
    max: parts[1] ? parseInt(parts[1]) || Infinity : Infinity,
  };
}

export default function CollectionPageClient({ collection, products }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategories, setSelectedCategories] = useState<
    ProductCategory[]
  >(() => {
    const tur = searchParams.get('tur');
    return tur ? (tur.split(',') as ProductCategory[]) : [];
  });
  const [priceRange, setPriceRange] = useState(() =>
    parsePriceParam(searchParams.get('fiyat'))
  );

  const updateURL = useCallback(
    (cats: ProductCategory[], price: { min: number; max: number }) => {
      const params = new URLSearchParams(searchParams.toString());
      if (cats.length > 0) {
        params.set('tur', cats.join(','));
      } else {
        params.delete('tur');
      }
      if (price.min > 0 || price.max !== Infinity) {
        params.set(
          'fiyat',
          `${price.min}-${price.max === Infinity ? '' : price.max}`
        );
      } else {
        params.delete('fiyat');
      }
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const toggleCategory = (cat: ProductCategory) => {
    const next = selectedCategories.includes(cat)
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];
    setSelectedCategories(next);
    updateURL(next, priceRange);
  };

  const selectPriceRange = (range: (typeof PRICE_RANGES)[number]) => {
    const next = { min: range.min, max: range.max };
    setPriceRange(next);
    updateURL(selectedCategories, next);
  };

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const catOk =
        selectedCategories.length === 0 ||
        selectedCategories.includes(p.category);
      const priceOk = p.price >= priceRange.min && p.price <= priceRange.max;
      return catOk && priceOk;
    });
  }, [products, selectedCategories, priceRange]);

  if (collection.slug === 'klasikler' && products.length === 0) {
    return (
      <section className="px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-gold/20 bg-[#f7f1e7] px-6 py-14 text-center md:px-12">
          <p className="section-label mb-4">Yakında</p>
          <h2 className="font-serif text-3xl font-light tracking-[-0.025em] md:text-5xl">
            Yeni klasikler hazırlanıyor.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-black/60 md:text-base">
            Zamansız formlardan oluşan ilk Klasikler seçkisi için son dokunuşları yapıyoruz.
          </p>
          <Link
            href="/collections/yeni-gelenler"
            className="mt-7 inline-flex rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gold-dark"
          >
            Yeni gelenleri keşfet
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div>
      {/* Filter + grid */}
      <section className="px-6 md:px-12 py-10">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 mb-8 pb-6 border-b border-black/8">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const active = selectedCategories.includes(cat.value);
              return (
                <button
                  key={cat.value}
                  onClick={() => toggleCategory(cat.value)}
                  className={`pill transition-colors duration-200 ${
                    active ? 'pill-dark' : 'pill-light'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="w-px h-4 bg-black/15 hidden sm:block" />

          {/* Price pills */}
          <div className="flex flex-wrap gap-2">
            {PRICE_RANGES.map((range) => {
              const active =
                priceRange.min === range.min && priceRange.max === range.max;
              return (
                <button
                  key={range.label}
                  onClick={() => selectPriceRange(range)}
                  className={`pill transition-colors duration-200 ${
                    active ? 'pill-dark' : 'pill-light'
                  }`}
                >
                  {range.label}
                </button>
              );
            })}
          </div>

          <span className="ml-auto text-xs text-black/35">
            {filtered.length} ürün
          </span>
        </div>

        {/* Product grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.04,
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="font-serif text-2xl text-black/30">
              Bu filtreyle eşleşen ürün yok.
            </p>
            <button
              onClick={() => {
                setSelectedCategories([]);
                setPriceRange({ min: 0, max: Infinity });
                updateURL([], { min: 0, max: Infinity });
              }}
              className="mt-4 text-sm text-gold hover:underline"
            >
              Filtreleri temizle
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
