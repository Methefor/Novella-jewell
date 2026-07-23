'use client';

import { SHIPPING } from '@/lib/config';
import { kargoTamamlayicilar } from '@/lib/recommendations';
import { useCartStore } from '@/store/cartStore';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';

interface Props {
  /** Drawer'da dar, sepet sayfasında geniş yerleşim */
  varyant?: 'drawer' | 'sayfa';
}

/**
 * "Kargoyu bedavaya getir" şeridi — sepet eşiğin altındayken, eşiği
 * tamamlayacak ürünleri tek tıkla ekletir. 499₺ + 1 ürün = ücretsiz kargo
 * stratejisinin arayüzdeki karşılığı.
 */
export default function KargoTamamlayici({ varyant = 'drawer' }: Props) {
  const { items, subtotal, addItem } = useCartStore();

  const eksik = SHIPPING.freeThreshold - subtotal;

  const oneriler = useMemo(
    () =>
      kargoTamamlayicilar(
        subtotal,
        items.map((i) => i.product.id),
        varyant === 'drawer' ? 3 : 4
      ),
    [subtotal, items, varyant]
  );

  if (eksik <= 0 || oneriler.length === 0) return null;

  return (
    <div
      className={
        varyant === 'drawer'
          ? 'px-5 py-4 border-t border-gold/20 bg-champagne/60'
          : 'mt-10 rounded-2xl border border-gold/25 bg-champagne/60 p-6'
      }
    >
      <p className="font-sans text-[12px] font-medium text-black/70 mb-3">
        <span className="text-gold-dark">
          {eksik.toLocaleString('tr-TR')} ₺
        </span>{' '}
        daha ekleyin, kargo bizden olsun ({SHIPPING.fee.toLocaleString('tr-TR')}{' '}
        ₺ tasarruf)
      </p>

      <div
        className={
          varyant === 'drawer'
            ? 'space-y-2.5'
            : 'grid grid-cols-1 sm:grid-cols-2 gap-3'
        }
      >
        {oneriler.map((p) => {
          const varyantUrun = p.variants.find((v) => v.id === p.defaultVariant);
          const gorsel = varyantUrun?.images[0];
          return (
            <div
              key={p.id}
              className="flex items-center gap-3 rounded-xl bg-white/80 border border-black/5 p-2 pr-3"
            >
              <Link
                href={`/urun/${p.slug}`}
                className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-cream"
              >
                {gorsel && (
                  <Image
                    src={gorsel}
                    alt={p.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                )}
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/urun/${p.slug}`}
                  className="block font-sans text-[12.5px] text-black/80 truncate hover:text-gold-dark transition-colors"
                >
                  {p.name}
                </Link>
                <span className="font-sans text-[12px] font-medium text-black">
                  {p.price.toLocaleString('tr-TR')} ₺
                </span>
              </div>
              <button
                type="button"
                onClick={() => addItem(p, p.defaultVariant)}
                aria-label={`${p.name} sepete ekle`}
                className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 hover:bg-gold transition-colors duration-300"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
