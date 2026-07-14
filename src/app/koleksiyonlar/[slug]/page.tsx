import { getAllCollections, getCollectionBySlug } from '@/data/collections';
import { SITE } from '@/lib/config';
import { getProductsByCollection } from '@/lib/products';
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
  const title = `${col.sehir || 'Klasikler'} Koleksiyonu — NOVELLA`;
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

  const products = getProductsByCollection(slug);

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
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <CollectionPageClient collection={col} products={products} />
      </Suspense>
    </>
  );
}
