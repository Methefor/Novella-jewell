import { getAllCollections } from '@/data/collections';
import { SITE } from '@/lib/config';
import { getAllProducts } from '@/lib/products';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const now = new Date();

  // NOT: Sitemap'e yalnızca 200 dönen gerçek sayfalar girer.
  // Yönlendirilen (/hakkimizda) veya var olmayan (/iletisim) adresler
  // Google Search Console'da hata üretir.
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/koleksiyonlar`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/hikayemiz`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/sss`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/kargo`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/iade`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/iletisim`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/gizlilik`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/kvkk`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/cerez-politikasi`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    // NOT: /mesafeli-satis-sozlesmesi ve /on-bilgilendirme sitemap'e girmez —
    // ikisi de noindex; arama sonucunda çıkmaları istenmiyor, sipariş akışının
    // parçası olarak erişilebilir olmaları yeterli.
  ];

  // Kategori / vitrin sayfaları — /collections/[category]
  const categoryPages: MetadataRoute.Sitemap = [
    'yeni-gelenler',
    'cok-satanlar',
    'bilezik',
    'kupe',
    'yuzuk',
  ].map((cat) => ({
    url: `${base}/collections/${cat}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

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

  return [...staticPages, ...categoryPages, ...collectionPages, ...productPages];
}
