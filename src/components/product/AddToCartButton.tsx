/**
 * NOVELLA - Add to Cart Button Component
 * Sepete ekle butonu
 */

'use client';

import { useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';

interface AddToCartButtonProps {
  productName: string;
  variantId: string;
  isInStock: boolean;
  onAddToCart?: (variantId: string, quantity: number) => void;
}

export default function AddToCartButton({
  productName,
  variantId,
  isInStock,
  onAddToCart,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    if (!isInStock) return;

    // Call external handler if provided
    if (onAddToCart) {
      onAddToCart(variantId, quantity);
    }

    // Başarı animasyonu
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const incrementQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, 10)); // Max 10
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1)); // Min 1
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div>
        <label className="text-sm font-medium text-black mb-2 block">
          Adet
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={decrementQuantity}
            disabled={quantity <= 1 || !isInStock}
            className="
              w-10 h-10 rounded-lg border-2 border-cream-300
              flex items-center justify-center
              text-black hover:border-gold hover:text-gold
              transition-colors duration-200
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-cream-300 disabled:hover:text-black
            "
            aria-label="Azalt"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>

          <input
            type="number"
            min="1"
            max="10"
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (!isNaN(val) && val >= 1 && val <= 10) {
                setQuantity(val);
              }
            }}
            disabled={!isInStock}
            className="
              w-16 h-10 text-center border-2 border-cream-300 rounded-lg
              font-medium text-black
              focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          />

          <button
            onClick={incrementQuantity}
            disabled={quantity >= 10 || !isInStock}
            className="
              w-10 h-10 rounded-lg border-2 border-cream-300
              flex items-center justify-center
              text-black hover:border-gold hover:text-gold
              transition-colors duration-200
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-cream-300 disabled:hover:text-black
            "
            aria-label="Arttır"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={!isInStock || isAdded}
        className={`
          w-full py-4 rounded-lg font-medium
          flex items-center justify-center gap-2
          transition-all duration-300
          ${
            isAdded
              ? 'bg-green-600 text-white'
              : isInStock
              ? 'bg-gold text-white hover:bg-gold/90 active:scale-95'
              : 'bg-cream-200 text-black/40 cursor-not-allowed'
          }
        `}
      >
        {isAdded ? (
          <>
            <Check className="w-5 h-5" />
            <span>Sepete Eklendi!</span>
          </>
        ) : (
          <>
            <ShoppingBag className="w-5 h-5" />
            <span>{isInStock ? 'Sepete Ekle' : 'Stokta Yok'}</span>
          </>
        )}
      </button>

      {/* Buy Now Button */}
      {isInStock && (
        <button
          className="
            w-full py-4 rounded-lg font-medium
            border-2 border-gold text-gold
            hover:bg-gold hover:text-white
            transition-all duration-200
            active:scale-95
          "
        >
          Hemen Satın Al
        </button>
      )}
    </div>
  );
}
