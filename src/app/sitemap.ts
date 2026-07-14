import { getAllCollections } from '@/data/collections';
import { SITE } from '@/lib/config';
import { getAllProducts } from '@/lib/products';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/koleksiyonlar`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/hakkimizda`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/iletisim`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const collectionPages: MetadataRoute.Sitemap = getAllCollections().map((col) => ({
    url: `${base}/koleksiyonlar/${col.slug}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  const productPages: MetadataRoute.Sitemap = getAllProducts().map((product) => ({
    url: `${base}/urun/${product.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...collectionPages, ...productPages];
}
