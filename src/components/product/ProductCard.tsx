'use client';

import FavoriButton from '@/components/product/FavoriButton';
import { trackAddToCart } from '@/lib/analytics';
import { dusukStok } from '@/lib/products';
import { useCartStore } from '@/store/cartStore';
import type { Product } from '@/types/product';
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

  const handleAddToCart = () => {
    addToCart(product, product.defaultVariant, 1);
    trackAddToCart(product, 1);
  };

  return (
    <article className="group block">
      <Link
        href={`/urun/${product.slug}`}
        className="block"
        aria-label={`${product.name} ürün detayına git`}
      >
        <div
          className="relative w-full overflow-hidden rounded-xl border border-black/[0.04] bg-[#eee8df] shadow-[0_12px_35px_rgba(66,52,31,0.04)]"
          style={{ aspectRatio: '1/1' }}
          role="img"
          aria-label={`${product.name} ürün görseli`}
        >
          <Image
            src={img1}
            alt={`${product.name} - ${categoryLabel[product.category] ?? product.category}`}
            fill
            className={`object-cover transition-all duration-700 ease-spring ${img2 ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-105'}`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {img2 && (
            <>
              <Image
                src={img2}
                alt={`${product.name} - alternatif görünüm`}
                fill
                className="object-cover scale-105 opacity-0 transition-all duration-700 ease-spring group-hover:scale-100 group-hover:opacity-100"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <span className="absolute bottom-3 left-3 z-10 hidden translate-y-2 rounded-full border border-white/40 bg-black/45 px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-white/90 opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:inline-flex">
                İkinci görünüm
              </span>
            </>
          )}

          <FavoriButton product={product} variant="card" />

          <div
            className="absolute top-3 left-3 z-10 flex flex-col gap-1.5"
            aria-label="Ürün etiketleri"
          >
            {product.isNew && (
              <span
                className="rounded-full bg-black px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-white"
                role="status"
                aria-label="Yeni ürün"
              >
                Yeni
              </span>
            )}
            {hasDiscount && (
              <span
                className="rounded-full bg-gold px-2.5 py-1 text-[10px] font-medium text-white"
                role="status"
                aria-label={`%${discountPct} indirim`}
              >
                %{discountPct}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="mt-3.5">
        <p className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-black/50">
          {categoryLabel[product.category] ?? product.category}
        </p>

        <Link href={`/urun/${product.slug}`} className="block">
          <h3 className="line-clamp-2 min-h-10 text-[13px] font-medium leading-5 text-black transition-colors duration-200 group-hover:text-gold-dark sm:text-sm">
            {product.name}
          </h3>
        </Link>

        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-sm font-semibold text-black sm:text-[15px]">
            {product.price.toLocaleString('tr-TR')} ₺
          </span>
          {hasDiscount && (
            <span
              className="text-xs text-black/45 line-through"
              aria-label="Eski fiyat"
            >
              {product.compareAtPrice!.toLocaleString('tr-TR')} ₺
            </span>
          )}
        </div>

        {stokBilgi.goster && (
          <p className="mt-1.5 text-xs font-medium text-[#80683c]">
            Son {stokBilgi.adet} adet
          </p>
        )}

        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-black bg-black px-3 py-2.5 text-[12px] font-medium tracking-[0.04em] text-white transition-all duration-200 hover:border-gold-dark hover:bg-gold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 sm:text-[13px]"
          aria-label={`${product.name} ürününü sepete ekle`}
        >
          <ShoppingBag className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Sepete Ekle</span>
        </button>
      </div>
    </article>
  );
}
