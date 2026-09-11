import { getAllCollections, getCollectionBySlug } from '@/data/collections';
import { SITE } from '@/lib/config';
import { getCatalogProducts } from '@/lib/catalog';
export const revalidate = 60;
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import CollectionPageClient from './CollectionPageClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllCollections().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const col = getCollectionBySlug(slug as Parameters<typeof getCollectionBySlug>[0]);
  if (!col) return {};
  const title = `${col.sehir || 'Klasikler'} Koleksiyonu`;
  const pageUrl = `${SITE.url}/koleksiyonlar/${slug}`;
  return {
    title,
    description: col.aciklamaKisa,
    alternates: { canonical: pageUrl },
    openGraph: { title, description: col.aciklamaKisa, url: pageUrl, type: 'website' },
  };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;

  const col = getCollectionBySlug(slug as Parameters<typeof getCollectionBySlug>[0]);
  if (!col) notFound();

  const products = (await getCatalogProducts()).filter((p) => p.collection === slug);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: SITE.url },
      { '@type': 'ListItem', position: 2, name: 'Koleksiyonlar', item: `${SITE.url}/koleksiyonlar` },
      { '@type': 'ListItem', position: 3, name: col.sehir || 'Klasikler', item: `${SITE.url}/koleksiyonlar/${slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main className="min-h-screen bg-white">
        <section className="px-6 md:px-16 lg:px-24 pt-24 pb-16 border-b border-black/8 max-w-5xl">
          <p className="section-label mb-6">Koleksiyon · {col.ton}</p>
          <h1 className="font-serif font-light text-5xl md:text-7xl text-black mb-8">{col.sehir || 'Klasikler'} Koleksiyonu</h1>
          <p className="font-serif text-xl md:text-2xl text-black/70 leading-relaxed max-w-2xl">{col.hikaye}</p>
        </section>
      <Suspense fallback={<p className="p-6" role="status">Ürünler yükleniyor…</p>}>
        <CollectionPageClient collection={col} products={products} />
      </Suspense>
      </main>
    </>
  );
}
