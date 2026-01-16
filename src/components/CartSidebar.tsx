'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/lib/cart';

export default function CartSidebar() {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, getTotalPrice } = useCart();
  const total = getTotalPrice();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="glass-strong fixed right-0 top-0 z-50 flex h-full w-full flex-col border-l border-white/10 shadow-2xl sm:w-[450px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/20">
                  <ShoppingBag className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <h2 className="font-cormorant text-2xl font-bold text-white">Sepetim</h2>
                  <p className="font-inter text-sm text-white/60">
                    {items.length} ürün
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleCart}
                className="text-white/60 transition-colors hover:text-white"
              >
                <X className="h-6 w-6" />
              </motion.button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
                    <ShoppingBag className="h-10 w-10 text-white/30" />
                  </div>
                  <h3 className="mb-2 font-cormorant text-xl font-semibold text-white">
                    Sepetiniz Boş
                  </h3>
                  <p className="mb-6 font-inter text-sm text-white/60">
                    Henüz ürün eklemediniz. Koleksiyonumuzu keşfedin!
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleCart}
                    className="rounded-full bg-gold px-6 py-3 font-inter font-semibold text-black transition-all hover:bg-gold-light"
                  >
                    Alışverişe Başla
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="glass group relative overflow-hidden rounded-xl p-4 transition-all hover:bg-white/10"
                    >
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-white/5">
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gold/10 to-rose-gold/10">
                            <span className="font-cormorant text-2xl text-white/20">
                              {item.category[0]}
                            </span>
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <h3 className="font-cormorant text-lg font-semibold text-white">
                              {item.name}
                            </h3>
                            <p className="font-inter text-sm text-white/60">
                              {item.category}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                              >
                                <Minus className="h-3 w-3" />
                              </motion.button>

                              <span className="w-8 text-center font-inter text-sm font-semibold text-white">
                                {item.quantity}
                              </span>

                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                              >
                                <Plus className="h-3 w-3" />
                              </motion.button>
                            </div>

                            {/* Price */}
                            <div className="font-inter text-lg font-bold text-gold">
                              ₺{item.price * item.quantity}
                            </div>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeItem(item.id)}
                          className="absolute right-2 top-2 rounded-full bg-red-500/20 p-2 text-red-400 opacity-0 transition-all hover:bg-red-500/30 group-hover:opacity-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-white/10 p-6">
                {/* Subtotal */}
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-inter text-sm text-white/60">Ara Toplam</span>
                  <span className="font-inter text-lg font-semibold text-white">
                    ₺{total}
                  </span>
                </div>

                <div className="mb-4 flex items-center justify-between">
                  <span className="font-inter text-sm text-white/60">Kargo</span>
                  <span className="font-inter text-sm font-semibold text-green-400">
                    Ücretsiz
                  </span>
                </div>

                <div className="mb-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="font-inter text-lg font-semibold text-white">Toplam</span>
                  <span className="font-cormorant text-2xl font-bold text-gold">
                    ₺{total}
                  </span>
                </div>

                {/* Checkout Button */}
                <motion.a
                  href="/checkout"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="block w-full rounded-full bg-gold-gradient py-4 text-center font-inter font-semibold text-black shadow-lg transition-all hover:shadow-xl hover:shadow-gold/30"
                >
                  Ödemeye Geç
                </motion.a>

                {/* Trust Badges */}
                <div className="mt-4 flex items-center justify-center gap-4 text-xs text-white/40">
                  <div className="flex items-center gap-1">
                    <span>🔒</span>
                    <span>Güvenli Ödeme</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>🚚</span>
                    <span>Ücretsiz Kargo</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>↩️</span>
                    <span>Kolay İade</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
