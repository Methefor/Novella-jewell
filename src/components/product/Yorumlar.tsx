'use client';

import { getProductReviews } from '@/data/reviews';
import { SITE } from '@/lib/config';
import { BadgeCheck, Camera, Star } from 'lucide-react';
import Image from 'next/image';

interface Props {
  productId: string;
  urunAdi: string;
}

/**
 * Ürün yorumları — gerçek müşteri değerlendirmeleri + fotoğraflar.
 * Yorum yoksa müşteriyi WhatsApp üzerinden fotoğraflı yorum göndermeye
 * davet eder (sosyal kanıt toplama akışı).
 */
export default function Yorumlar({ productId, urunAdi }: Props) {
  const yorumlar = getProductReviews(productId);

  const yorumLinki = `https://api.whatsapp.com/send?phone=${SITE.whatsapp}&text=${encodeURIComponent(
    `Merhaba, "${urunAdi}" ürünü hakkında yorumumu ve fotoğrafımı paylaşmak istiyorum.`
  )}`;

  return (
    <section className="mt-24 border-t border-black/8 pt-16">
      <div className="flex items-baseline justify-between mb-8">
        <div>
          <p className="section-label mb-2">Sizden gelenler</p>
          <h2
            className="font-serif font-light text-2xl text-black"
            style={{ letterSpacing: '-0.02em' }}
          >
            Değerlendirmeler
            {yorumlar.length > 0 && (
              <span className="ml-2 text-sm text-black/40">
                ({yorumlar.length})
              </span>
            )}
          </h2>
        </div>
      </div>

      {yorumlar.length === 0 ? (
        <div className="rounded-2xl border border-gold/25 bg-champagne/40 p-8 text-center">
          <p className="font-serif text-lg text-black/60 mb-2">
            Bu ürün için ilk değerlendirmeyi siz yapın
          </p>
          <p className="text-sm text-black/45 mb-6 max-w-md mx-auto">
            Ürününüzü kullanırken çektiğiniz bir fotoğrafla yorumunuzu
            gönderin, sitede yayınlayalım.
          </p>
          <a
            href={yorumLinki}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2 text-sm"
          >
            <Camera className="w-4 h-4" />
            Fotoğraflı Yorum Gönder
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {yorumlar.map((y) => (
            <article
              key={y.id}
              className="rounded-2xl border border-black/8 bg-white p-6"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="flex" aria-label={`${y.rating} yıldız`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < y.rating
                          ? 'text-gold fill-gold'
                          : 'text-black/10'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-black">
                  {y.author.name}
                </span>
                {y.author.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-gold-dark">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    Doğrulanmış alışveriş
                  </span>
                )}
              </div>
              {y.title && (
                <p className="text-sm font-medium text-black mb-1">{y.title}</p>
              )}
              <p className="text-sm text-black/60 leading-relaxed">
                {y.comment}
              </p>
              {y.images && y.images.length > 0 && (
                <div className="flex gap-2 mt-4">
                  {y.images.map((img, i) => (
                    <div
                      key={i}
                      className="relative w-20 h-20 rounded-lg overflow-hidden bg-cream"
                    >
                      <Image
                        src={img}
                        alt={`${y.author.name} müşteri fotoğrafı`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}

          <a
            href={yorumLinki}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2 text-sm"
          >
            <Camera className="w-4 h-4" />
            Siz de Fotoğraflı Yorum Gönderin
          </a>
        </div>
      )}
    </section>
  );
}
