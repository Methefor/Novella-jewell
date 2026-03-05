/**
 * NOVELLA - Cart Drawer Component
 * Sağdan açılan sepet drawer'ı - Framer Motion spring animations
 */

'use client';

import { useCartStore, selectHasItems } from '@/store/cartStore';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import CartItem from './CartItem';
import CartSummary from './CartSummary';

export default function CartDrawer() {
  const isOpen = useCartStore((state) => state.isDrawerOpen);
  const items = useCartStore((state) => state.items);
  const hasItems = useCartStore(selectHasItems);
  const closeDrawer = useCartStore((state) => state.closeDrawer);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeDrawer();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeDrawer]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={closeDrawer}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[450px] max-w-full bg-white z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200">
              <h2 className="font-serif text-2xl text-black flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-gold" />
                Sepetim
              </h2>
              <button
                onClick={closeDrawer}
                className="p-2 hover:bg-cream-100 rounded-lg transition-colors"
                aria-label="Kapat"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            {hasItems ? (
              <>
                {/* Items List */}
                <div className="flex-1 overflow-y-auto px-6">
                  {items.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.3 }}
                    >
                      <CartItem item={item} />
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t border-cream-200 px-6 py-4 space-y-4">
                  {/* Summary */}
                  <CartSummary showCoupon={false} />

                  {/* Buttons */}
                  <div className="space-y-3">
                    <Link
                      href="/checkout"
                      onClick={closeDrawer}
                      className="block w-full py-3 px-4 bg-gold text-white text-center font-medium rounded-lg hover:bg-gold/90 transition-colors"
                    >
                      Alışverişi Tamamla
                    </Link>

                    <button
                      onClick={closeDrawer}
                      className="w-full py-3 px-4 border-2 border-cream-300 text-black text-center font-medium rounded-lg hover:bg-cream-50 transition-colors"
                    >
                      Alışverişe Devam Et
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                  className="w-24 h-24 rounded-full bg-cream-100 flex items-center justify-center mb-6"
                >
                  <ShoppingBag className="w-12 h-12 text-gold/40" />
                </motion.div>

                <h3 className="font-serif text-2xl text-black mb-2">
                  Sepetiniz Boş
                </h3>

                <p className="text-black/60 mb-6">
                  Henüz sepetinize ürün eklemediniz.
                </p>

                <Link
                  href="/collections"
                  onClick={closeDrawer}
                  className="px-6 py-3 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors font-medium"
                >
                  Ürünleri Keşfet
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
