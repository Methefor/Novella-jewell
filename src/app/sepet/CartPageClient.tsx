'use client';

import KargoTamamlayici from '@/components/cart/KargoTamamlayici';
import OneriSeridi from '@/components/product/OneriSeridi';
import { useCartHydrated } from '@/hooks/useCartHydrated';
import { trackRemoveFromCart, trackViewCart } from '@/lib/analytics';
import { SHIPPING } from '@/lib/config';
import { useCartStore } from '@/store/cartStore';
import { motion } from 'framer-motion';
import {
  Gift,
  Lock,
  Minus,
  Plus,
  RotateCcw,
  ShoppingBag,
  Trash2,
  Truck,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const ease = [0.16, 1, 0.3, 1] as const;

export default function CartPageClient() {
  const { items, subtotal, shippingCost, total, removeItem, updateQuantity } =
    useCartStore();
  const hydrated = useCartHydrated();
  const [mobilOdemeCta, setMobilOdemeCta] = useState(false);
  const anaOdemeButonu = useRef<HTMLAnchorElement>(null);
  const sepetIzlendi = useRef(false);

  const freeShippingLeft = Math.max(0, SHIPPING.freeThreshold - subtotal);
  // İlerleme yüzdesi — drawer'daki çubukla aynı mantık.
  const freeShippingPct = Math.min(
    100,
    (subtotal / SHIPPING.freeThreshold) * 100
  );

  useEffect(() => {
    if (!hydrated || sepetIzlendi.current || items.length === 0) return;
    sepetIzlendi.current = true;
    trackViewCart(
      subtotal,
      items.map((item) => item.product)
    );
  }, [hydrated, items, subtotal]);

  useEffect(() => {
    const button = anaOdemeButonu.current;
    if (!button) return;
    const observer = new IntersectionObserver(
      ([entry]) => setMobilOdemeCta(!entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(button);
    return () => observer.disconnect();
  }, [items.length]);

  if (!hydrated) return null;

  if (items.length === 0) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center gap-8 px-6 pt-24 pb-20 text-center">
        <div className="w-16 h-16 rounded-full bg-cream-deep flex items-center justify-center">
          <ShoppingBag className="w-7 h-7 text-black/20" strokeWidth={1} />
        </div>
        <div>
          <h1 className="font-serif text-2xl text-black/40">Sepetiniz boş</h1>
          <p className="text-sm text-black/30 mt-2">
            Koleksiyonumuzu keşfederek başlayın.
          </p>
        </div>
        <Link href="/koleksiyonlar" className="btn-primary">
          Koleksiyonu Keşfet
        </Link>

        {/* Boş sepette bile kullanıcıyı ürüne yönlendir */}
        <OneriSeridi baslik="Yeni Gelenler" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-24 lg:pb-0">
      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-24 pb-20">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="font-serif font-light text-3xl md:text-4xl text-black mb-10"
          style={{ letterSpacing: '-0.02em' }}
        >
          Sepetim
        </motion.h1>

        <div className="mb-10 grid grid-cols-3 border-y border-black/10 py-4">
          {[
            { icon: Gift, label: 'Hediye kutusunda' },
            { icon: Truck, label: 'Takipli teslimat' },
            { icon: RotateCcw, label: '14 gün cayma hakkı' },
          ].map(({ icon: Icon, label }, index) => (
            <div
              key={label}
              className={`flex flex-col items-center justify-center gap-2 px-2 text-center text-[10px] text-black/55 sm:flex-row sm:text-xs ${
                index > 0 ? 'border-l border-black/10' : ''
              }`}
            >
              <Icon className="h-4 w-4 text-gold-dark" strokeWidth={1.6} />
              {label}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-10">
          {/* Items */}
          <div className="space-y-0 divide-y divide-black/8">
            {items.map((item) => {
              const img = item.variant.images[0];
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-5 py-6"
                >
                  {/* Image */}
                  <Link
                    href={`/urun/${item.product.slug}`}
                    className="relative flex-shrink-0 w-24 md:w-28 overflow-hidden bg-[#F6F6F4] rounded-lg"
                    style={{ aspectRatio: '1/1' }}
                  >
                    {img && (
                      <Image
                        src={img}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="120px"
                      />
                    )}
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/urun/${item.product.slug}`}
                      className="text-base font-medium text-black hover:text-gold transition-colors leading-snug"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-black/40 mt-0.5">
                      Birim fiyat: {item.product.price.toLocaleString('tr-TR')}{' '}
                      ₺
                    </p>

                    {/* Quantity stepper */}
                    <div className="flex items-center gap-3 mt-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center border border-black/15 rounded-lg hover:border-black/40 hover:bg-black/5 transition-all"
                          aria-label="Azalt"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center border border-black/15 rounded-lg hover:border-black/40 hover:bg-black/5 transition-all"
                          aria-label="Artır"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          trackRemoveFromCart(item.product, item.quantity);
                          removeItem(item.id);
                        }}
                        className="flex items-center gap-1 text-xs text-black/30 hover:text-black/60 transition-colors ml-auto"
                        aria-label="Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Kaldır
                      </button>
                    </div>
                  </div>

                  {/* Row total */}
                  <div className="text-base font-semibold text-black flex-shrink-0 pt-0.5">
                    {(item.product.price * item.quantity).toLocaleString(
                      'tr-TR'
                    )}{' '}
                    ₺
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Summary */}
          <div>
            <div className="sticky top-24 bg-[#F9F9F7] p-6 rounded-lg border border-black/8 shadow-sm">
              <h2 className="font-serif text-lg text-black mb-5">
                Sipariş Özeti
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-black/60">
                  <span>Ara toplam</span>
                  <span>{subtotal.toLocaleString('tr-TR')} ₺</span>
                </div>
                <div className="flex justify-between text-black/60">
                  <span>Kargo</span>
                  <span>
                    {shippingCost === 0
                      ? 'Bedava'
                      : `${shippingCost.toLocaleString('tr-TR')} ₺`}
                  </span>
                </div>

                {/* Kargo çubuğu — drawer'la aynı görsel dil. Sadece metin
                    yerine ilerleme gösterince "biraz daha ekleyeyim" hissi
                    somutlaşıyor; sepet ortalamasını yükselten kanıtlı taktik. */}
                {freeShippingLeft > 0 ? (
                  <div className="pt-1">
                    <p className="text-xs text-black/60 mb-1.5">
                      <span className="font-medium text-gold-dark">
                        {freeShippingLeft.toLocaleString('tr-TR')} ₺
                      </span>{' '}
                      daha ekleyin, kargo bedava
                    </p>
                    <div
                      className="h-1 bg-black/8 rounded-full overflow-hidden"
                      role="progressbar"
                      aria-valuenow={Math.round(freeShippingPct)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Ücretsiz kargoya ilerleme"
                    >
                      <motion.div
                        className="h-full bg-gold rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${freeShippingPct}%` }}
                        transition={{ duration: 0.5, ease }}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gold-dark font-medium pt-1">
                    Ücretsiz kargo kazandınız
                  </p>
                )}

                <div className="border-t border-black/8 pt-3 flex justify-between font-semibold text-black text-base">
                  <span>Toplam</span>
                  <span>{total.toLocaleString('tr-TR')} ₺</span>
                </div>
              </div>

              <Link
                ref={anaOdemeButonu}
                href="/odeme"
                className="btn-primary w-full flex items-center justify-center gap-2 mt-6"
              >
                Ödemeye Geç
              </Link>

              <p className="text-xs text-black/30 text-center mt-4 flex items-center justify-center gap-1.5">
                <Lock className="w-3 h-3" />
                256-bit SSL ile güvenli ödeme
              </p>
            </div>
          </div>
        </div>

        {/* Kargo eşiğini tamamlayacak öneriler */}
        <KargoTamamlayici varyant="sayfa" />
      </div>

      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-lg transition-all duration-300 lg:hidden ${
          mobilOdemeCta
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-full opacity-0'
        }`}
      >
        <div className="mx-auto flex max-w-lg items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-black/45">
              {items.reduce((sum, item) => sum + item.quantity, 0)} ürün
            </p>
            <p className="mt-0.5 text-base font-semibold">
              {total.toLocaleString('tr-TR')} ₺
            </p>
          </div>
          <Link
            href="/odeme"
            className="inline-flex min-h-12 flex-shrink-0 items-center justify-center gap-2 rounded-full bg-black px-7 text-sm font-semibold text-white"
          >
            <Lock className="h-4 w-4" />
            Ödemeye Geç
          </Link>
        </div>
      </div>
    </main>
  );
}
