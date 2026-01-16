import ProductDetail from '@/components/ProductDetail';
import { getProductBySlug } from '@/lib/products';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}


export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Ürün Bulunamadı | NOVELLA',
    };
  }

  return {
    title: `${product.name} | NOVELLA`,
    description: product.description || `${product.name} - Premium çelik takı`,
    openGraph: {
      title: product.name,
      description: product.description || '',
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product && process.env.NODE_ENV === 'production') {
    return (
      <div className="min-h-screen bg-[#0F0F0F] pt-24 pb-20 text-center">
        <h1 className="text-white">Ürün yükleniyor veya bulunamadı...</h1>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] pt-24 pb-20">
      <ProductDetail product={product} />
    </div>
  );
}

