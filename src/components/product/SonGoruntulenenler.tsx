'use client';

import ProductCard from '@/components/product/ProductCard';
import { getAllProducts } from '@/lib/products';
import { useRecentStore } from '@/store/recentStore';
import type { Product } from '@/types/product';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const ease = [0.16, 1, 0.3, 1] as const;

interface Props {
  /** Şu an görüntülenen ürün — hem listeden çıkarılır hem geçmişe eklenir. */
  currentId: string;
}

/**
 * "Son görüntülediğiniz" şeridi.
 *
 * İki iş yapar:
 *  1. Bu ürünü görüntülenenlere ekler (mount'ta).
 *  2. Önceki görüntülenenleri (bu ürün hariç) gösterir.
 *
 * Ürün nesneleri products.ts'ten ID ile çözülür — güncel fiyat/stok gelir.
 * mounted guard: liste localStorage'dan geliyor, SSR'da boş; guard olmadan
 * hydration uyuşmazlığı olur.
 */
export default function SonGoruntulenenler({ currentId }: Props) {
  const [mounted, setMounted] = useState(false);
  const ids = useRecentStore((s) => s.ids);
  const ekle = useRecentStore((s) => s.ekle);

  useEffect(() => {
    setMounted(true);
    ekle(currentId);
  }, [currentId, ekle]);

  if (!mounted) return null;

  const tumProduct = getAllProducts();
  const urunler = ids
    .filter((id) => id !== currentId)
    .map((id) => tumProduct.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p))
    .slice(0, 4);

  if (urunler.length === 0) return null;

  return (
    <section className="mt-20 border-t border-black/8 pt-14">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease }}
        className="font-serif font-light text-black mb-8"
        style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em' }}
      >
        Son Görüntülediğiniz
      </motion.h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {urunler.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: i * 0.06, ease }}
          >
            <ProductCard product={p} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
