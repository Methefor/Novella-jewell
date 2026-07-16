import { getCollectionBySlug } from '@/data/collections';
import { SITE } from '@/lib/config';
import { getAllProducts, getProductBySlug } from '@/lib/products';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductPageClient from './ProductPageClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  const title = `${product.name} — NOVELLA`;
  const description = product.metaDescription ?? product.description;
  const pageUrl = `${SITE.url}/urun/${slug}`;
  const coverImage = product.variants[0]?.images[0];
  const ogImage = coverImage
    ? [
        {
          url: coverImage.startsWith('http')
            ? coverImage
            : `${SITE.url}${coverImage}`,
          width: 800,
          height: 1000,
          alt: product.name,
        },
      ]
    : undefined;
  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: 'website',
      ...(ogImage ? { images: ogImage } : {}),
    },
  };
}

export default async function UrunPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const collection = getCollectionBySlug(product.collection);
  const pageUrl = `${SITE.url}/urun/${slug}`;
  const coverImage = product.variants[0]?.images[0];
  const absoluteImage = coverImage
    ? coverImage.startsWith('http')
      ? coverImage
      : `${SITE.url}${coverImage}`
    : undefined;

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    url: pageUrl,
    ...(absoluteImage ? { image: absoluteImage } : {}),
    brand: { '@type': 'Brand', name: 'NOVELLA' },
    itemCondition: 'https://schema.org/NewCondition',
    // ⚠️ aggregateRating BİLEREK YOK.
    // src/data/products.ts içindeki rating/reviewCount değerleri elle yazılmış
    // örnek verilerdir — sitede gerçek bir yorum sistemi yok. Gerçek olmayan
    // review markup'ı Google'ın structured data politikasını ihlal eder ve
    // manuel işlem (ceza) sebebidir. Gerçek yorum toplamaya başlayınca
    // aggregateRating'i buraya GERÇEK verilerden hesaplayarak ekle.
    offers: {
      '@type': 'Offer',
      priceCurrency: 'TRY',
      price: product.price.toFixed(2),
      url: pageUrl,
      // Google tüm offer'larda priceValidUntil bekler (sadece indirimlilerde değil).
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      availability: product.variants.some((v) => v.stock > 0)
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'NOVELLA', url: SITE.url },
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: SITE.url },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Koleksiyonlar',
        item: `${SITE.url}/koleksiyonlar`,
      },
      ...(collection
        ? [
            {
              '@type': 'ListItem',
              position: 3,
              name: collection.sehir || 'Klasikler',
              item: `${SITE.url}/koleksiyonlar/${product.collection}`,
            },
          ]
        : []),
      {
        '@type': 'ListItem',
        position: collection ? 4 : 3,
        name: product.name,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductPageClient product={product} collection={collection} />
    </>
  );
}
