import { getAllCollections } from '@/data/collections';
import { getCatalogProducts } from '@/lib/catalog';
import { SITE } from '@/lib/config';
import { MetadataRoute } from 'next';
import { REHBER_YAZILARI } from '@/data/rehber';
export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;
  const now = new Date();

  // NOT: Sitemap'e yalnızca 200 dönen gerçek sayfalar girer.
  // Yönlendirilen /hakkimizda yerine kanonik /hikayemiz kullanılır.
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/urunler`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/koleksiyonlar`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/hikayemiz`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/sss`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/kargo`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/iade`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/iletisim`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/gizlilik`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/kvkk`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/cerez-politikasi`, changeFrequency: 'yearly', priority: 0.2 },
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
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  const collectionPages: MetadataRoute.Sitemap = getAllCollections().map((col) => ({
    url: `${base}/koleksiyonlar/${col.slug}`,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // Admin panelinden yayına alınan dinamik ürünler de sitemap'e girmeli.
  // Statik ürün listesini kullanmak yeni ürünlerin Google tarafından
  // keşfedilmesini geciktiriyordu.
  const products = await getCatalogProducts();
  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${base}/urun/${product.slug}`,
    lastModified: product.updatedAt ?? now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...collectionPages, ...productPages,
    { url: base + '/rehber', changeFrequency: 'monthly', priority: 0.5 },
    ...REHBER_YAZILARI.map((article) => ({ url: base + '/rehber/' + article.slug, lastModified: article.tarih, priority: 0.5 })),
  ];
}
