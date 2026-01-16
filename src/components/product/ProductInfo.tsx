/**
 * NOVELLA - Product Info Component
 * Ürün bilgileri, açıklama, özellikler
 */

'use client';

import type { Product } from '@/types/product';
import { ChevronDown, Package, Shield, Star, Truck } from 'lucide-react';
import { useState } from 'react';

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [openAccordion, setOpenAccordion] = useState<string>('description');

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? '' : id);
  };

  // İndirim hesaplama
  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const discountAmount = hasDiscount
    ? product.originalPrice! - product.price
    : 0;

  return (
    <div className="space-y-6">
      {/* Kategori */}
      <div className="text-sm uppercase tracking-wider text-gold">
        {product.category}
      </div>

      {/* Ürün Adı */}
      <h1 className="font-serif text-3xl lg:text-4xl text-black">
        {product.name}
      </h1>

      {/* Rating & Reviews */}
      {product.rating && product.reviewCount && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(product.rating!)
                    ? 'text-gold fill-gold'
                    : 'text-cream-300 fill-cream-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-black/60">
            {product.rating} ({product.reviewCount} değerlendirme)
          </span>
        </div>
      )}

      {/* Fiyat */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-black">
          {product.price.toLocaleString('tr-TR')}₺
        </span>
        {hasDiscount && (
          <>
            <span className="text-xl text-black/40 line-through">
              {product.originalPrice!.toLocaleString('tr-TR')}₺
            </span>
            <span className="px-2 py-1 bg-red-600 text-white text-sm font-medium rounded">
              %{product.discountPercentage} İNDİRİM
            </span>
          </>
        )}
      </div>

      {hasDiscount && (
        <p className="text-sm text-green-600">
          {discountAmount.toLocaleString('tr-TR')}₺ tasarruf ediyorsunuz!
        </p>
      )}

      {/* Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        {product.isNew && <span className="badge-new">YENİ</span>}
        {product.isBestSeller && (
          <span className="badge-bestseller">ÇOK SATAN</span>
        )}
        {product.isCustomizable && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gold/10 text-gold text-sm font-medium rounded-md">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            İsim Baskısı Yapılabilir
          </span>
        )}
      </div>

      {/* Kısa Açıklama */}
      <p className="text-black/70 leading-relaxed">{product.description}</p>

      {/* Trust Icons */}
      <div className="grid grid-cols-3 gap-4 py-6 border-y border-cream-200">
        <div className="text-center">
          <Package className="w-6 h-6 text-gold mx-auto mb-2" />
          <p className="text-xs text-black/60">Hızlı Kargo</p>
        </div>
        <div className="text-center">
          <Shield className="w-6 h-6 text-gold mx-auto mb-2" />
          <p className="text-xs text-black/60">Güvenli Alışveriş</p>
        </div>
        <div className="text-center">
          <Truck className="w-6 h-6 text-gold mx-auto mb-2" />
          <p className="text-xs text-black/60">Ücretsiz İade</p>
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="space-y-2">
        {/* Özellikler */}
        <div className="border-b border-cream-200">
          <button
            onClick={() => toggleAccordion('features')}
            className="w-full py-4 flex items-center justify-between text-left"
          >
            <span className="font-medium text-black">Ürün Özellikleri</span>
            <ChevronDown
              className={`w-5 h-5 text-gold transition-transform ${
                openAccordion === 'features' ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openAccordion === 'features' && (
            <div className="pb-4">
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-black/70"
                  >
                    <svg
                      className="w-5 h-5 text-gold flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Kargo & İade */}
        <div className="border-b border-cream-200">
          <button
            onClick={() => toggleAccordion('shipping')}
            className="w-full py-4 flex items-center justify-between text-left"
          >
            <span className="font-medium text-black">Kargo & İade</span>
            <ChevronDown
              className={`w-5 h-5 text-gold transition-transform ${
                openAccordion === 'shipping' ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openAccordion === 'shipping' && (
            <div className="pb-4 space-y-3 text-sm text-black/70">
              <p>
                <strong className="text-black">Kargo:</strong> 300 TL ve üzeri
                alışverişlerde ücretsiz kargo.
              </p>
              <p>
                <strong className="text-black">Teslimat:</strong> Siparişiniz
                1-3 iş günü içinde kargoya verilir.
              </p>
              <p>
                <strong className="text-black">İade:</strong> 14 gün içinde
                ücretsiz iade hakkı.
              </p>
            </div>
          )}
        </div>

        {/* Bakım Talimatları */}
        <div className="border-b border-cream-200">
          <button
            onClick={() => toggleAccordion('care')}
            className="w-full py-4 flex items-center justify-between text-left"
          >
            <span className="font-medium text-black">Bakım Talimatları</span>
            <ChevronDown
              className={`w-5 h-5 text-gold transition-transform ${
                openAccordion === 'care' ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openAccordion === 'care' && (
            <div className="pb-4 space-y-2 text-sm text-black/70">
              <p>• Parfüm ve kimyasallardan uzak tutun</p>
              <p>• Yumuşak bir bezle temizleyin</p>
              <p>• Su ile temas ettikten sonra kurulayın</p>
              <p>• Kapalı kutuda saklayın</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
