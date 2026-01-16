/**
 * NOVELLA - Mini Cart Component
 * Header'daki sepet ikonu ve badge
 */

'use client';

import { ShoppingBag } from 'lucide-react';
import { useCartStore, selectCartItemCount } from '@/store/cartStore';

export default function MiniCart() {
  const itemCount = useCartStore(selectCartItemCount);
  const openDrawer = useCartStore((state) => state.openDrawer);

  return (
    <button
      onClick={openDrawer}
      className="relative p-2 hover:bg-cream-100 rounded-lg transition-colors group"
      aria-label="Sepet"
    >
      <ShoppingBag className="w-6 h-6 text-black group-hover:text-gold transition-colors" />
      
      {itemCount > 0 && (
        <span className="
          absolute -top-1 -right-1
          w-5 h-5 
          bg-gold text-white text-xs font-bold
          rounded-full
          flex items-center justify-center
          animate-in zoom-in duration-200
        ">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </button>
  );
}
