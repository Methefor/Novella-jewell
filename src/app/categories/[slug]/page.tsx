import ProductGrid from '@/components/ProductGrid';
import { getProductsByCategory } from '@/lib/products';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}


export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${categoryName} | NOVELLA`,
    description: `NOVELLA ${categoryName} koleksiyonu - Premium çelik takılar`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categoryName = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const products = await getProductsByCategory(slug);

  // Skip notFound during build if no products are returned (common when CMS is not configured)
  if (products.length === 0 && process.env.NODE_ENV === 'production') {
    return (
      <div className="min-h-screen bg-[#0F0F0F] pt-24 pb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-white">Kategori yükleniyor veya boş...</h1>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-cormorant text-5xl font-bold text-white md:text-6xl">
            {categoryName}
          </h1>
          <p className="mx-auto max-w-2xl font-inter text-lg text-white/60">
            {products.length} ürün bulundu
          </p>
        </div>

        {/* Products Grid */}
        <ProductGrid products={products} />
      </div>
    </div>
  );
}

