import { getRehberYazisi, REHBER_YAZILARI } from '@/data/rehber';
import { SITE } from '@/lib/config';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return REHBER_YAZILARI.map((y) => ({ slug: y.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const yazi = getRehberYazisi(slug);
  if (!yazi) return {};
  return {
    title: yazi.baslik,
    description: yazi.ozet,
    alternates: { canonical: `${SITE.url}/rehber/${yazi.slug}` },
    openGraph: {
      type: 'article',
      title: yazi.baslik,
      description: yazi.ozet,
      url: `${SITE.url}/rehber/${yazi.slug}`,
    },
  };
}

export default async function RehberYazisiPage({ params }: Props) {
  const { slug } = await params;
  const yazi = getRehberYazisi(slug);
  if (!yazi) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: yazi.baslik,
    description: yazi.ozet,
    datePublished: yazi.tarih,
    author: { '@type': 'Organization', name: SITE.name },
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    mainEntityOfPage: `${SITE.url}/rehber/${yazi.slug}`,
  };

  return (
    <main className="min-h-screen bg-white pt-28 pb-24 px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-2xl mx-auto">
        <Link
          href="/rehber"
          className="text-xs text-black/40 hover:text-gold-dark transition-colors"
        >
          ← Takı Rehberi
        </Link>
        <h1
          className="font-serif font-light text-3xl md:text-4xl text-black mt-4 mb-10 text-balance"
          style={{ letterSpacing: '-0.02em', lineHeight: 1.15 }}
        >
          {yazi.baslik}
        </h1>

        {yazi.bolumler.map((bolum, i) => (
          <section key={i} className="mb-10">
            <h2
              className="font-serif font-light text-xl md:text-2xl text-black mb-4"
              style={{ letterSpacing: '-0.01em' }}
            >
              {bolum.baslik}
            </h2>
            {bolum.paragraflar.map((p, j) => (
              <p
                key={j}
                className="text-[15px] text-black/65 leading-relaxed mb-4"
              >
                {p}
              </p>
            ))}
          </section>
        ))}

        <div className="mt-14 rounded-2xl border border-gold/25 bg-champagne/50 p-8 text-center">
          <p className="font-serif text-xl text-black mb-2">
            Kararmayan çelik, eskimeyen zarafet
          </p>
          <p className="text-sm text-black/50 mb-6">
            316L cerrahi çelik koleksiyonumuzu keşfedin.
          </p>
          <Link href="/koleksiyonlar" className="btn-primary inline-block">
            Koleksiyonu Keşfet
          </Link>
        </div>
      </article>
    </main>
  );
}
