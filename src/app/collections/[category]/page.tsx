import { SITE } from '@/lib/config';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategoryClient from './CategoryClient';

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
      'NOVELLA koleksiyonuna en son eklenen 316L çelik takılar. Kararmaz, alerji yapmaz, suya dayanıklı.',
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
  kolye: {
    title: 'Kolyeler',
    description:
      'Paslanmaz çelik kolye modelleri. Kararmayan, suya dayanıklı, alerji yapmayan 316L çelik.',
  },
  bilezik: {
    title: 'Bileklikler',
    description:
      'Paslanmaz çelik bileklik modelleri. Duşta çıkarmanız gerekmeyen, kararmayan 316L çelik.',
  },
  kupe: {
    title: 'Küpeler',
    description:
      'Paslanmaz çelik küpe modelleri. Hassas ciltler için hipoalerjenik 316L cerrahi çelik.',
  },
  yuzuk: {
    title: 'Yüzükler',
    description:
      'Paslanmaz çelik yüzük modelleri. Kararmayan, solmayan, günlük kullanıma uygun 316L çelik.',
  },
};

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

  return <CategoryClient category={category} />;
}
