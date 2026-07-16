'use client';

import { useCartStore } from '@/store/cartStore';
import type { Product } from '@/types/product';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

const categoryLabel: Record<string, string> = {
  kolye: 'Kolye',
  kupe: 'Küpe',
  bilezik: 'Bileklik',
  yuzuk: 'Yüzük',
};

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addItem);

  const defaultVariant =
    product.variants.find((v) => v.id === product.defaultVariant) ??
    product.variants[0];

  const gallery = product.images ?? defaultVariant.images;
  const img1 = gallery[0];
  const img2 = gallery[1] ?? null;

  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;

  const discountPct = hasDiscount
    ? Math.round(
        ((product.compareAtPrice! - product.price) / product.compareAtPrice!) *
          100
      )
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, product.defaultVariant, 1);
  };

  return (
    <Link href={`/urun/${product.slug}`} className="group block">
      {/* Image container — 4:5 */}
      <div
        className="relative w-full overflow-hidden bg-[#F6F6F4]"
        style={{ aspectRatio: '4/5' }}
      >
        {/* Primary image */}
        <Image
          src={img1}
          alt={product.name}
          fill
          className={`object-cover transition-opacity duration-500 ${img2 ? 'group-hover:opacity-0' : ''}`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Secondary image (hover swap) */}
        {img2 && (
          <Image
            src={img2}
            alt={product.name}
            fill
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.isNew && (
            <span className="bg-black text-white text-[10px] font-medium tracking-widest uppercase px-2 py-0.5">
              Yeni
            </span>
          )}
          {hasDiscount && (
            <span className="bg-gold text-white text-[10px] font-medium px-2 py-0.5">
              %{discountPct}
            </span>
          )}
        </div>

        {/* Sepete Ekle bar — slides up on hover (desktop) / always visible (mobile) */}
        <motion.div
          className="absolute inset-x-0 bottom-0 z-10 bg-black/90 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300"
          style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
        >
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 py-3 text-white text-sm font-medium tracking-wide hover:bg-gold transition-colors duration-200"
          >
            <ShoppingBag className="w-4 h-4" />
            Sepete Ekle
          </button>
        </motion.div>
      </div>

      {/* Info below card */}
      <div className="mt-3">
        <p className="text-[11px] uppercase tracking-widest text-black/40 mb-0.5">
          {categoryLabel[product.category] ?? product.category}
        </p>
        <h3 className="text-sm font-medium text-black leading-snug group-hover:text-gold transition-colors duration-200">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-sm font-semibold text-black">
            {product.price.toLocaleString('tr-TR')} ₺
          </span>
          {hasDiscount && (
            <span className="text-xs text-black/35 line-through">
              {product.compareAtPrice!.toLocaleString('tr-TR')} ₺
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
