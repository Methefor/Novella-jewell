'use client';

import FavoriButton from '@/components/product/FavoriButton';
import { trackAddToCart } from '@/lib/analytics';
import { dusukStok } from '@/lib/products';
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

  const stokBilgi = dusukStok(product);

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
    trackAddToCart(product, 1);
  };

  return (
    <Link
      href={`/urun/${product.slug}`}
      className="group block"
      aria-label={`${product.name} ürün detayına git`}
    >
      {/* Image container — 1:1 kare, yumuşak köşe */}
      <div
        className="relative w-full overflow-hidden img-slot rounded-lg"
        style={{ aspectRatio: '1/1' }}
        role="img"
        aria-label={`${product.name} ürün görseli`}
      >
        {/* Primary image — hover'da hafif zoom */}
        <Image
          src={img1}
          alt={`${product.name} - ${categoryLabel[product.category] ?? product.category}`}
          fill
          className={`object-cover transition-all duration-700 ease-spring ${img2 ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-105'}`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Secondary image (hover swap) */}
        {img2 && (
          <Image
            src={img2}
            alt={`${product.name} - alternatif görünüm`}
            fill
            className="object-cover opacity-0 scale-105 transition-all duration-700 ease-spring group-hover:opacity-100 group-hover:scale-100"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}

        {/* Favori (kalp) — sağ üst köşe */}
        <FavoriButton product={product} variant="card" />

        {/* Badges */}
        <div
          className="absolute top-3 left-3 flex flex-col gap-1.5 z-10"
          aria-label="Ürün etiketleri"
        >
          {product.isNew && (
            <span
              className="bg-black text-white text-[10px] font-medium tracking-widest uppercase px-2.5 py-1 rounded-full"
              role="status"
              aria-label="Yeni ürün"
            >
              Yeni
            </span>
          )}
          {hasDiscount && (
            <span
              className="bg-gold text-white text-[10px] font-medium px-2.5 py-1 rounded-full"
              role="status"
              aria-label={`%${discountPct} indirim`}
            >
              %{discountPct}
            </span>
          )}
        </div>

        {/* Sepete ekle: mobilde kompakt ikon, masaüstünde hover barı */}
        <motion.div
          className="absolute bottom-3 right-3 z-10 overflow-hidden rounded-full bg-black/90 shadow-lg backdrop-blur-sm md:inset-x-0 md:bottom-0 md:right-auto md:rounded-none md:shadow-none md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300"
          style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
        >
          <button
            onClick={handleAddToCart}
            className="flex h-11 w-11 items-center justify-center gap-2 text-white text-sm font-medium tracking-wide transition-colors duration-200 hover:bg-gold md:h-auto md:w-full md:py-3.5"
            aria-label={`${product.name} ürününü sepete ekle`}
          >
            <ShoppingBag className="w-4 h-4" aria-hidden="true" />
            <span className="sr-only md:not-sr-only">Sepete Ekle</span>
          </button>
        </motion.div>
      </div>

      {/* Info below card */}
      <div className="mt-3.5">
        <p className="text-[11px] uppercase tracking-widest text-black/40 mb-1">
          {categoryLabel[product.category] ?? product.category}
        </p>
        <h3 className="text-sm font-medium text-black leading-snug group-hover:text-gold transition-colors duration-200 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="text-sm font-semibold text-black">
            {product.price.toLocaleString('tr-TR')} ₺
          </span>
          {hasDiscount && (
            <span
              className="text-xs text-black/35 line-through"
              aria-label="Eski fiyat"
            >
              {product.compareAtPrice!.toLocaleString('tr-TR')} ₺
            </span>
          )}
        </div>

        {/* Düşük stok — kıtlık sinyali, gerçek stokla */}
        {stokBilgi.goster && (
          <p className="text-[11px] text-gold-dark font-medium mt-1.5">
            Son {stokBilgi.adet} adet
          </p>
        )}
      </div>
    </Link>
  );
}
