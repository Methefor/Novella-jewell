import { getAllCollections } from '@/data/collections';
import { SITE } from '@/lib/config';
import { getProductsByCollection } from '@/lib/products';
import type { Metadata } from 'next';
import CollectionIndexClient from './CollectionIndexClient';

export const metadata: Metadata = {
  title: 'Koleksiyonlar — NOVELLA',
  description:
    'Barcelona, Stockholm, Paris ve Klasikler. Her koleksiyon bir şehirde geçen hikaye, her parça o hikayenin bir bölümü.',
  alternates: { canonical: `${SITE.url}/koleksiyonlar` },
  openGraph: {
    title: 'Koleksiyonlar — NOVELLA',
    description: 'Barcelona, Stockholm, Paris ve Klasikler. Her koleksiyon bir şehirde geçen hikaye.',
    url: `${SITE.url}/koleksiyonlar`,
    type: 'website',
  },
};

export default function KoleksiyonlarPage() {
  const collections = getAllCollections();

  const collectionsWithMeta = collections.map((col) => {
    const products = getProductsByCollection(col.slug);
    const coverImage =
      products[0]?.variants[0]?.images[0] ?? null;
    return { ...col, productCount: products.length, coverImage };
  });

  return <CollectionIndexClient collections={collectionsWithMeta} />;
}
