/**
 * NOVELLA - Cart Item Component
 * Sepetteki tek ürün kartı
 */

'use client';

import type { CartItem as CartItemType } from '@/store/cartStore';
import { useCartStore } from '@/store/cartStore';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CartItemProps {
  item: CartItemType;
}

// Renk label'ları
const colorLabels: Record<string, string> = {
  altin: 'Altın',
  gumus: 'Gümüş',
  'rose-gold': 'Rose Gold',
  siyah: 'Siyah',
  beyaz: 'Beyaz',
  'cok-renkli': 'Çok Renkli',
};

export default function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const itemTotal = item.product.price * item.quantity;
  const colorLabel = item.variant.color ? (colorLabels[item.variant.color] || item.variant.color) : 'Varsayılan';

  return (
    <div className="flex gap-4 py-4 border-b border-cream-200">
      {/* Image */}
      <Link href={`/products/${item.product.slug}`} className="flex-shrink-0">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-cream-50">
          <Image
            src={item.product.images?.[0] || '/placeholder-product.jpg'}
            alt={item.product.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link href={`/products/${item.product.slug}`}>
          <h3 className="font-medium text-black hover:text-gold transition-colors line-clamp-1">
            {item.product.name}
          </h3>
        </Link>

        <div className="text-sm text-black/60 mt-1">
          <p>Renk: {colorLabel}</p>
          {item.customization && (
            <p className="text-gold">İsim Baskısı: {item.customization}</p>
          )}
        </div>

        {/* Quantity & Price */}
        <div className="flex items-center justify-between mt-3">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="w-7 h-7 rounded border border-cream-300 flex items-center justify-center hover:border-gold transition-colors"
              aria-label="Azalt"
            >
              <Minus className="w-3 h-3" />
            </button>

            <span className="w-8 text-center font-medium text-sm">
              {item.quantity}
            </span>

            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              disabled={item.quantity >= item.variant.stock}
              className="w-7 h-7 rounded border border-cream-300 flex items-center justify-center hover:border-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Arttır"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="font-bold text-black">
              {itemTotal.toLocaleString('tr-TR')}₺
            </p>
            {item.quantity > 1 && (
              <p className="text-xs text-black/60">
                {item.product.price.toLocaleString('tr-TR')}₺ / adet
              </p>
            )}
          </div>
        </div>

        {/* Stock Warning */}
        {item.quantity >= item.variant.stock && (
          <p className="text-xs text-orange-600 mt-2">
            Maksimum stok adedine ulaştınız
          </p>
        )}
      </div>

      {/* Remove Button */}
      <button
        onClick={() => removeItem(item.id)}
        className="flex-shrink-0 p-2 hover:bg-red-50 rounded-lg text-black/40 hover:text-red-600 transition-colors"
        aria-label="Sepetten çıkar"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}
