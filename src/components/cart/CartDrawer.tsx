/**
 * NOVELLA - Cart Drawer Component
 * Sağdan açılan sepet drawer'ı
 */

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { X, ShoppingBag } from 'lucide-react';
import { useCartStore, selectHasItems } from '@/store/cartStore';
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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-200"
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div
        className="
          fixed top-0 right-0 bottom-0 
          w-full sm:w-[450px] max-w-full
          bg-white z-50
          flex flex-col
          animate-in slide-in-from-right duration-300
        "
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
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
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
                  className="
                    block w-full py-3 px-4
                    bg-gold text-white text-center font-medium rounded-lg
                    hover:bg-gold/90 transition-colors
                  "
                >
                  Alışverişi Tamamla
                </Link>

                <button
                  onClick={closeDrawer}
                  className="
                    w-full py-3 px-4
                    border-2 border-cream-300 text-black text-center font-medium rounded-lg
                    hover:bg-cream-50 transition-colors
                  "
                >
                  Alışverişe Devam Et
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className="w-24 h-24 rounded-full bg-cream-100 flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-gold/40" />
            </div>
            
            <h3 className="font-serif text-2xl text-black mb-2">
              Sepetiniz Boş
            </h3>
            
            <p className="text-black/60 mb-6">
              Henüz sepetinize ürün eklemediniz.
            </p>

            <Link
              href="/collections"
              onClick={closeDrawer}
              className="
                px-6 py-3 bg-gold text-white rounded-lg
                hover:bg-gold/90 transition-colors
                font-medium
              "
            >
              Ürünleri Keşfet
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
