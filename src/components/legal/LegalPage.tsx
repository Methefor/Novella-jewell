import { YASAL_GUNCELLEME } from '@/lib/legal';
import Link from 'next/link';
import type { ReactNode } from 'react';

interface LegalPageProps {
  title: string;
  intro?: string;
  children: ReactNode;
  /** Son güncelleme tarihini gizle (ör. iletişim sayfası) */
  hideUpdated?: boolean;
}

/**
 * Tüm yasal/bilgi sayfalarının ortak düzeni.
 * Mobil öncelikli: tek sütun, okunabilir satır uzunluğu (max-w-3xl),
 * dokunma hedefleri en az 44px.
 */
export default function LegalPage({
  title,
  intro,
  children,
  hideUpdated,
}: LegalPageProps) {
  return (
    <main className="bg-cream min-h-screen">
      {/* Başlık */}
      <header className="relative overflow-hidden bg-champagne border-b border-gold/25">
        <div className="absolute inset-0 texture-gold" aria-hidden="true" />
        <div className="container-custom relative py-14 md:py-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
              <p className="font-sans text-[11px] tracking-[0.18em] uppercase text-gold-dark">
                NOVELLA
              </p>
            </div>
            <h1
              className="font-serif font-light text-black text-balance"
              style={{
                fontSize: 'clamp(1.9rem, 4.5vw, 3rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
              }}
            >
              {title}
            </h1>
            {intro && (
              <p
                className="font-sans font-light text-black/60 mt-5 max-w-2xl text-balance"
                style={{ fontSize: '15px', lineHeight: 1.75 }}
              >
                {intro}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* İçerik */}
      <div className="container-custom py-12 md:py-16">
        <article className="legal-prose max-w-3xl">{children}</article>

        {!hideUpdated && (
          <p className="max-w-3xl mt-12 pt-6 border-t border-border font-sans text-[13px] text-black/40">
            Son güncelleme: {YASAL_GUNCELLEME}
          </p>
        )}

        <div className="max-w-3xl mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-sans text-[13px] font-medium text-black/50 hover:text-gold-dark transition-colors"
          >
            <span aria-hidden="true">←</span> Ana sayfaya dön
          </Link>
        </div>
      </div>
    </main>
  );
}
