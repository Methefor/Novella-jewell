import { getAllCollections, getCollectionBySlug } from '@/data/collections';
import { getProductsByCollection } from '@/lib/products';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import CollectionPageClient from './CollectionPageClient';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tur?: string; fiyat?: string }>;
}

export async function generateStaticParams() {
  return getAllCollections().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const col = getCollectionBySlug(slug as Parameters<typeof getCollectionBySlug>[0]);
  if (!col) return {};
  return {
    title: `${col.sehir || 'Klasikler'} Koleksiyonu — NOVELLA`,
    description: col.aciklamaKisa,
  };
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { tur, fiyat } = await searchParams;

  const col = getCollectionBySlug(slug as Parameters<typeof getCollectionBySlug>[0]);
  if (!col) notFound();

  const products = getProductsByCollection(slug);

  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <CollectionPageClient
        collection={col}
        products={products}
        initialTur={tur}
        initialFiyat={fiyat}
      />
    </Suspense>
  );
}
