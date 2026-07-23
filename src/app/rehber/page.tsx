import { REHBER_YAZILARI } from '@/data/rehber';
import { SITE } from '@/lib/config';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Takı Rehberi',
  description:
    'Çelik takı bakımı, 316L cerrahi çelik ve küpe hijyeni hakkında bilmeniz gereken her şey — NOVELLA takı rehberi.',
  alternates: { canonical: `${SITE.url}/rehber` },
};

export default function RehberPage() {
  return (
    <main className="min-h-screen bg-white pt-28 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="section-label mb-3">Bilgi & Bakım</p>
        <h1
          className="font-serif font-light text-3xl md:text-4xl text-black mb-4"
          style={{ letterSpacing: '-0.02em' }}
        >
          Takı Rehberi
        </h1>
        <p className="text-sm text-black/50 mb-12 max-w-xl">
          Çeliğin neden kararmadığından küpe hijyenine — takınızı yıllarca ilk
          günkü gibi tutmanız için hazırladığımız rehberler.
        </p>

        <div className="space-y-6">
          {REHBER_YAZILARI.map((yazi) => (
            <Link
              key={yazi.slug}
              href={`/rehber/${yazi.slug}`}
              className="block rounded-2xl border border-black/8 p-6 md:p-8 transition-all duration-300 hover:border-gold/30 hover:shadow-[0_16px_44px_rgba(120,100,60,0.10)] hover:-translate-y-0.5"
            >
              <h2
                className="font-serif font-light text-xl md:text-2xl text-black mb-2"
                style={{ letterSpacing: '-0.01em' }}
              >
                {yazi.baslik}
              </h2>
              <p className="text-sm text-black/50 leading-relaxed">
                {yazi.ozet}
              </p>
              <span className="inline-block mt-4 text-xs font-medium text-gold-dark">
                Devamını oku →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
