/**
 * NOVELLA - Cart Summary Component
 * Sepet özeti (fiyat, kargo, indirim, toplam)
 */

'use client';

import { useCartStore } from '@/store/cartStore';
import { Tag, X } from 'lucide-react';
import { useState } from 'react';

interface CartSummaryProps {
  showCoupon?: boolean;
}

export default function CartSummary({ showCoupon = true }: CartSummaryProps) {
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const subtotal = useCartStore((state) => state.subtotal);
  const shippingCost = useCartStore((state) => state.shippingCost);
  const discount = useCartStore((state) => state.discount);
  const total = useCartStore((state) => state.total);
  const applyCoupon = useCartStore((state) => state.applyCoupon);
  const removeCoupon = useCartStore((state) => state.removeCoupon);

  const hasCoupon = discount > 0;
  const freeShippingThreshold = 400;
  const remainingForFreeShipping = freeShippingThreshold - subtotal;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError('Kupon kodu giriniz');
      return;
    }

    const success = applyCoupon(couponCode);
    if (success) {
      setCouponCode('');
      setCouponError('');
    } else {
      setCouponError('Geçersiz kupon kodu');
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponCode('');
    setCouponError('');
  };

  return (
    <div className="space-y-4">
      {/* Free Shipping Progress */}
      {shippingCost > 0 && remainingForFreeShipping > 0 && (
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>{remainingForFreeShipping.toLocaleString('tr-TR')}₺</strong>{' '}
            daha alışveriş yapın,
            <strong> kargo bedava!</strong> 🎉
          </p>
          <div className="mt-2 h-2 bg-blue-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${(subtotal / freeShippingThreshold) * 100}%` }}
            />
          </div>
        </div>
      )}

      {shippingCost === 0 && subtotal >= freeShippingThreshold && (
        <div className="p-3 bg-green-50 rounded-lg text-sm text-green-800">
          ✅ Ücretsiz kargo kazandınız!
        </div>
      )}

      {/* Coupon Input */}
      {showCoupon && !hasCoupon && (
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Kupon Kodu
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value.toUpperCase());
                setCouponError('');
              }}
              placeholder="KUPON KODU"
              className="flex-1 px-3 py-2 border border-cream-300 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none text-sm"
            />
            <button
              onClick={handleApplyCoupon}
              className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors text-sm font-medium"
            >
              Uygula
            </button>
          </div>
          {couponError && (
            <p className="text-xs text-red-600 mt-1">{couponError}</p>
          )}
        </div>
      )}

      {/* Active Coupon */}
      {hasCoupon && (
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-green-800">
            <Tag className="w-4 h-4" />
            <span className="font-medium">Kupon uygulandı</span>
          </div>
          <button
            onClick={handleRemoveCoupon}
            className="p-1 hover:bg-green-100 rounded transition-colors"
          >
            <X className="w-4 h-4 text-green-600" />
          </button>
        </div>
      )}

      {/* Summary */}
      <div className="space-y-3 pt-4 border-t border-cream-200">
        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span className="text-black/60">Ara Toplam</span>
          <span className="font-medium text-black">
            {subtotal.toLocaleString('tr-TR')}₺
          </span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-sm">
          <span className="text-black/60">Kargo</span>
          <span className="font-medium text-black">
            {shippingCost === 0 ? (
              <span className="text-green-600">Ücretsiz</span>
            ) : (
              `${shippingCost.toLocaleString('tr-TR')}₺`
            )}
          </span>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-black/60">İndirim</span>
            <span className="font-medium text-green-600">
              -{discount.toLocaleString('tr-TR')}₺
            </span>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between pt-3 border-t border-cream-200">
          <span className="font-bold text-black">Toplam</span>
          <span className="font-bold text-xl text-gold">
            {total.toLocaleString('tr-TR')}₺
          </span>
        </div>
      </div>

      {/* Tax Info */}
      <p className="text-xs text-black/60 text-center">KDV dahildir</p>
    </div>
  );
}
