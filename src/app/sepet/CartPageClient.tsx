'use client';

import KargoTamamlayici from '@/components/cart/KargoTamamlayici';
import OneriSeridi from '@/components/product/OneriSeridi';
import { SHIPPING } from '@/lib/config';
import { useCartStore } from '@/store/cartStore';
import { motion } from 'framer-motion';
import { Lock, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const ease = [0.16, 1, 0.3, 1] as const;

export default function CartPageClient() {
  const { items, subtotal, shippingCost, total, removeItem, updateQuantity } =
    useCartStore();

  const freeShippingLeft = Math.max(0, SHIPPING.freeThreshold - subtotal);
  // İlerleme yüzdesi — drawer'daki çubukla aynı mantık.
  const freeShippingPct = Math.min(
    100,
    (subtotal / SHIPPING.freeThreshold) * 100
  );

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
    <main className="min-h-screen bg-white">
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
                        onClick={() => removeItem(item.id)}
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
    </main>
  );
}
