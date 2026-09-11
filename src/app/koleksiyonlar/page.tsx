import { getAllCollections } from '@/data/collections';
import { SITE } from '@/lib/config';
import { getCatalogProducts } from '@/lib/catalog';
export const revalidate = 60;
import type { Metadata } from 'next';
import CollectionIndexClient from './CollectionIndexClient';

export const metadata: Metadata = {
  title: 'Koleksiyonlar',
  description:
    'Barcelona, Stockholm, Paris ve Klasikler. Her koleksiyon bir şehirde geçen hikaye, her parça o hikayenin bir bölümü.',
  alternates: { canonical: `${SITE.url}/koleksiyonlar` },
  openGraph: {
    title: 'Koleksiyonlar',
    description: 'Barcelona, Stockholm, Paris ve Klasikler. Her koleksiyon bir şehirde geçen hikaye.',
    url: `${SITE.url}/koleksiyonlar`,
    type: 'website',
  },
};

export default async function KoleksiyonlarPage() {
  const catalog = await getCatalogProducts();
  const collections = getAllCollections();
  const classicsPreviewProduct = catalog.find(
    (product) => product.slug === 'paris-royale-markiz-tasli-altin-yuzuk'
  );
  const classicsPreviewGallery = classicsPreviewProduct?.images?.length
    ? classicsPreviewProduct.images
    : classicsPreviewProduct?.variants[0]?.images ?? [];
  const classicsPreview =
    classicsPreviewGallery[3] ??
    classicsPreviewGallery[1] ??
    classicsPreviewGallery[0] ??
    null;

  const collectionsWithMeta = collections.map((col) => {
    const products = catalog.filter((p) => p.collection === col.slug);
    const coverImage =
      products[0]?.images?.[1] ??
      products[0]?.variants[0]?.images[1] ??
      products[0]?.images?.[0] ??
      products[0]?.variants[0]?.images[0] ??
      (col.slug === 'klasikler' ? classicsPreview : null);
    return {
      ...col,
      productCount: products.length,
      coverImage,
      comingSoon: col.slug === 'klasikler' && products.length === 0,
    };
  });

  return <CollectionIndexClient collections={collectionsWithMeta} />;
}
