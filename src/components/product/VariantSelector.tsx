/**
 * NOVELLA - Variant Selector Component
 * Renk ve malzeme varyant seçici
 */

'use client';

import type { ProductVariant, ProductColor } from '@/types/product';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariantId: string;
  onSelectVariant: (variantId: string) => void;
}

// Renk hex değerleri
const colorHex: Record<ProductColor, string> = {
  'altin': '#D4AF37',
  'gumus': '#C0C0C0',
  'rose-gold': '#B76E79',
  'siyah': '#0F0F0F',
  'beyaz': '#FFFFFF',
  'cok-renkli': 'linear-gradient(135deg, #D4AF37, #B76E79, #C0C0C0)',
};

// Renk label'ları
const colorLabels: Record<ProductColor, string> = {
  'altin': 'Altın',
  'gumus': 'Gümüş',
  'rose-gold': 'Rose Gold',
  'siyah': 'Siyah',
  'beyaz': 'Beyaz',
  'cok-renkli': 'Çok Renkli',
};

export default function VariantSelector({
  variants,
  selectedVariantId,
  onSelectVariant,
}: VariantSelectorProps) {
  if (variants.length <= 1) {
    return null; // Tek varyant varsa gösterme
  }

  const selectedVariant = variants.find((v) => v.id === selectedVariantId);

  return (
    <div className="space-y-4">
      {/* Seçili Renk Bilgisi */}
      <div>
        <h3 className="text-sm font-medium text-black mb-2">
          Renk: <span className="text-gold">{colorLabels[selectedVariant?.color || 'altin']}</span>
        </h3>
      </div>

      {/* Renk Seçenekleri */}
      <div className="flex items-center gap-3">
        {variants.map((variant) => {
          const isSelected = variant.id === selectedVariantId;
          const isOutOfStock = variant.stock === 0;
          const color = variant.color;

          return (
            <button
              key={variant.id}
              onClick={() => !isOutOfStock && onSelectVariant(variant.id)}
              disabled={isOutOfStock}
              className={`
                relative group
                ${isOutOfStock ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
              title={`${colorLabels[color]} ${isOutOfStock ? '(Stokta Yok)' : ''}`}
            >
              {/* Color Swatch */}
              <div
                className={`
                  w-10 h-10 rounded-full border-2 transition-all duration-200
                  ${
                    isSelected
                      ? 'border-gold scale-110 ring-2 ring-gold/20'
                      : isOutOfStock
                      ? 'border-cream-300 opacity-40'
                      : 'border-cream-300 hover:border-gold/60 hover:scale-105'
                  }
                  ${color === 'beyaz' ? 'shadow-sm' : ''}
                `}
                style={{
                  background: colorHex[color].includes('gradient')
                    ? colorHex[color]
                    : colorHex[color],
                }}
              />

              {/* Stokta Yok İşareti */}
              {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-px h-12 bg-red-500 rotate-45" />
                </div>
              )}

              {/* Seçili İşareti */}
              {isSelected && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                </div>
              )}

              {/* Stok Durumu Tooltip */}
              <div
                className="
                  absolute -bottom-8 left-1/2 -translate-x-1/2
                  px-2 py-1 bg-black/80 text-white text-xs rounded
                  whitespace-nowrap
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-200
                  pointer-events-none
                "
              >
                {isOutOfStock ? 'Stokta Yok' : `${variant.stock} adet`}
              </div>
            </button>
          );
        })}
      </div>

      {/* Stok Bilgisi */}
      {selectedVariant && (
        <div className="text-sm">
          {selectedVariant.stock > 0 ? (
            <span className="text-green-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Stokta ({selectedVariant.stock} adet)
            </span>
          ) : (
            <span className="text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              Stokta Yok
            </span>
          )}
        </div>
      )}
    </div>
  );
}
