import { SITE } from '@/lib/config';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategoryClient from './CategoryClient';
import CatalogEmpty from '@/components/catalog/CatalogEmpty';
import { getCatalogProducts } from '@/lib/catalog';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

/**
 * Geçerli kategori/vitrin adresleri.
 * Bu liste hem 404 kontrolü hem de metadata için tek kaynak.
 *
 * NOT: Buraya yeni bir slug eklersen sitemap.ts'e de ekle.
 * NOT: Bu adresler /collections/ altında kalır — next.config.ts'teki
 * /collections/:slug yönlendirmesi yalnızca 4 gerçek koleksiyon slug'ıyla
 * eşleştiği için bunlar güvende.
 */
const CATEGORIES: Record<string, { title: string; description: string }> = {
  'yeni-gelenler': {
    title: 'Yeni Gelenler',
    description:
      'NOVELLA koleksiyonuna en son eklenen yüzük, küpe ve bileklikleri keşfedin. Güncel modeller, fiyatlar ve malzeme bilgileri.',
  },
  'cok-satanlar': {
    title: 'Çok Satanlar',
    description:
      'En çok tercih edilen NOVELLA takıları. 316L cerrahi çelik, hediye kutusunda.',
  },
  indirimler: {
    title: 'İndirimdekiler',
    description: 'NOVELLA takılarında indirimli fiyatlar. Sınırlı stok.',
  },
  bilezik: {
    title: 'Bileklikler',
    description:
      'NOVELLA paslanmaz çelik bileklik modellerini keşfedin. Zincir, taşlı ve geometrik tasarımları karşılaştırın.',
  },
  kupe: {
    title: 'Küpeler',
    description:
      'NOVELLA küpe koleksiyonunu keşfedin. Halka, taşlı ve sallantılı modellerin ölçü ve malzeme bilgilerini inceleyin.',
  },
  yuzuk: {
    title: 'Yüzükler',
    description:
      'NOVELLA yüzük modellerini keşfedin. Günlük stilinize uygun sade, taşlı ve ayarlanabilir tasarımlar.',
  },
};

export const revalidate = 60;

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const meta = CATEGORIES[category];

  if (!meta) return {};

  const pageUrl = `${SITE.url}/collections/${category}`;

  return {
    title: meta.title,
    description: meta.description,
    // Kendi canonical'ı — layout'tan miras alınan '/' bu sayfaları
    // ana sayfaya gömüyordu.
    alternates: { canonical: pageUrl },
    openGraph: {
      title: `${meta.title} — NOVELLA`,
      description: meta.description,
      url: pageUrl,
      type: 'website',
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  // Tanımsız kategori artık boş sayfa yerine 404 döner.
  if (!CATEGORIES[category]) notFound();

  const products = await getCatalogProducts();
  if (products.length === 0) return <main className="min-h-[60vh]"><CatalogEmpty /></main>;
  return <CategoryClient category={category} products={products} />;
}
