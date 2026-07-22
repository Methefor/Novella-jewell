'use client';

import { SHIPPING } from '@/lib/config';
import { useCartStore } from '@/store/cartStore';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ease = [0.16, 1, 0.3, 1] as const;

export default function CartDrawer({ isOpen, onClose }: Props) {
  const { items, subtotal, shippingCost, total, removeItem, updateQuantity } =
    useCartStore();

  const freeShippingLeft = Math.max(0, SHIPPING.freeThreshold - subtotal);
  const freeShippingPct = Math.min(
    100,
    (subtotal / SHIPPING.freeThreshold) * 100
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-black/8">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-black/60" />
                <span className="text-sm font-medium text-black">
                  Sepetim
                  {items.length > 0 && (
                    <span className="ml-1.5 text-xs text-black/40">
                      ({items.length})
                    </span>
                  )}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-black/40 hover:text-black hover:bg-black/5 rounded-full transition-all"
                aria-label="Sepeti kapat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {items.length === 0 ? (
              /* Empty state */
              <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6 text-center">
                <div className="w-14 h-14 rounded-full bg-cream-deep flex items-center justify-center">
                  <ShoppingBag
                    className="w-6 h-6 text-black/20"
                    strokeWidth={1}
                  />
                </div>
                <div>
                  <p className="font-serif text-xl text-black/40">
                    Sepetiniz boş
                  </p>
                  <p className="text-sm text-black/30 mt-1">
                    Koleksiyonumuzu keşfedin
                  </p>
                </div>
                <Link
                  href="/koleksiyonlar"
                  onClick={onClose}
                  className="btn-primary text-sm px-6 py-2.5"
                >
                  Koleksiyona Bak
                </Link>
              </div>
            ) : (
              <>
                {/* Free shipping progress */}
                {freeShippingLeft > 0 && (
                  <div className="px-5 py-3 bg-[#F9F9F7] border-b border-black/5">
                    <div className="flex justify-between text-xs text-black/50 mb-1.5">
                      <span>Bedava kargo için</span>
                      <span className="font-medium text-black/70">
                        {freeShippingLeft.toLocaleString('tr-TR')} ₺ kaldı
                      </span>
                    </div>
                    <div className="h-0.5 bg-black/8 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gold rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${freeShippingPct}%` }}
                        transition={{ duration: 0.5, ease }}
                      />
                    </div>
                  </div>
                )}
                {freeShippingLeft === 0 && (
                  <div className="px-5 py-2.5 bg-[#F9F9F7] border-b border-black/5 text-xs text-gold font-medium">
                    Kargo bedava!
                  </div>
                )}

                {/* Items */}
                <div className="flex-1 overflow-y-auto divide-y divide-black/5">
                  {items.map((item) => {
                    const img = item.variant.images[0];
                    return (
                      <div key={item.id} className="flex gap-3 p-4">
                        {/* Image */}
                        <Link
                          href={`/urun/${item.product.slug}`}
                          onClick={onClose}
                          className="relative flex-shrink-0 w-16 overflow-hidden bg-[#F6F6F4] rounded-lg"
                          style={{ aspectRatio: '1/1' }}
                        >
                          {img && (
                            <Image
                              src={img}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          )}
                        </Link>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/urun/${item.product.slug}`}
                            onClick={onClose}
                            className="text-sm font-medium text-black leading-snug hover:text-gold transition-colors line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-xs text-black/40 mt-0.5">
                            {item.product.price.toLocaleString('tr-TR')} ₺
                          </p>

                          {/* Quantity + delete */}
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="w-7 h-7 flex items-center justify-center border border-black/15 rounded-lg hover:border-black/40 hover:bg-black/5 transition-all"
                                aria-label="Azalt"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-7 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="w-7 h-7 flex items-center justify-center border border-black/15 rounded-lg hover:border-black/40 hover:bg-black/5 transition-all"
                                aria-label="Artır"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-black/25 hover:text-black/60 transition-colors ml-auto"
                              aria-label="Sil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Row total */}
                        <div className="text-sm font-medium text-black flex-shrink-0 pt-0.5">
                          {(item.product.price * item.quantity).toLocaleString(
                            'tr-TR'
                          )}{' '}
                          ₺
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="border-t border-black/8 p-5 space-y-3">
                  <div className="flex justify-between text-sm text-black/50">
                    <span>Ara toplam</span>
                    <span>{subtotal.toLocaleString('tr-TR')} ₺</span>
                  </div>
                  <div className="flex justify-between text-sm text-black/50">
                    <span>Kargo</span>
                    <span>
                      {shippingCost === 0
                        ? 'Bedava'
                        : `${shippingCost.toLocaleString('tr-TR')} ₺`}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-semibold text-black pt-1 border-t border-black/8">
                    <span>Toplam</span>
                    <span>{total.toLocaleString('tr-TR')} ₺</span>
                  </div>

                  <Link
                    href="/sepet"
                    onClick={onClose}
                    className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
                  >
                    Sepete Git
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
