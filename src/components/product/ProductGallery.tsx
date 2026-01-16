/**
 * NOVELLA - Product Gallery Component
 * Ürün görselleri galerisi (thumbnail navigation + zoom)
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[3/4] bg-cream-50 rounded-lg overflow-hidden group">
        <Image
          src={images[selectedIndex]}
          alt={`${productName} - Görsel ${selectedIndex + 1}`}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Zoom Icon */}
        <button
          onClick={() => setIsZoomed(true)}
          className="
            absolute top-4 right-4 p-2
            bg-white/90 backdrop-blur-sm rounded-full
            opacity-0 group-hover:opacity-100
            transition-opacity duration-200
            hover:bg-white
          "
          aria-label="Yakınlaştır"
        >
          <ZoomIn className="w-5 h-5 text-black" />
        </button>

        {/* Navigation Arrows (sadece birden fazla görsel varsa) */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="
                absolute left-4 top-1/2 -translate-y-1/2
                p-2 bg-white/90 backdrop-blur-sm rounded-full
                opacity-0 group-hover:opacity-100
                transition-opacity duration-200
                hover:bg-white
              "
              aria-label="Önceki görsel"
            >
              <ChevronLeft className="w-5 h-5 text-black" />
            </button>

            <button
              onClick={handleNext}
              className="
                absolute right-4 top-1/2 -translate-y-1/2
                p-2 bg-white/90 backdrop-blur-sm rounded-full
                opacity-0 group-hover:opacity-100
                transition-opacity duration-200
                hover:bg-white
              "
              aria-label="Sonraki görsel"
            >
              <ChevronRight className="w-5 h-5 text-black" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <div className="px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>
        )}
      </div>

      {/* Thumbnails (sadece birden fazla görsel varsa) */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`
                relative aspect-square rounded-lg overflow-hidden
                border-2 transition-all duration-200
                ${
                  selectedIndex === index
                    ? 'border-gold scale-105'
                    : 'border-cream-200 hover:border-gold/40'
                }
              `}
            >
              <Image
                src={image}
                alt={`${productName} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 p-2 text-white hover:text-gold transition-colors"
            aria-label="Kapat"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative w-full max-w-4xl aspect-[3/4]">
            <Image
              src={images[selectedIndex]}
              alt={`${productName} - Büyük görsel`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {/* Modal Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
