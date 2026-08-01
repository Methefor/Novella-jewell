import { getAdminAuth } from '@/lib/admin-auth';
import { getCatalogProducts } from '@/lib/catalog';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ContentStudioClient, { type MotionProduct } from './ContentStudioClient';

export const dynamic = 'force-dynamic';

export default async function ContentStudioPage() {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') redirect('/admin/giris');

  const products: MotionProduct[] = (await getCatalogProducts())
    .filter((product) => product.category === 'yuzuk')
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      images: Array.from(new Set((product.images?.length ? product.images : product.variants.flatMap((variant) => variant.images)).filter(Boolean))),
    }))
    .filter((product) => product.images.length > 0);

  return (
    <main className="min-h-screen bg-[#f4efe7] px-4 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <Link href="/admin" className="text-sm text-neutral-600">← Dashboard</Link>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-[#947d4e]">Novella Creative Studio</p>
            <h1 className="mt-2 font-heading text-4xl sm:text-5xl">İçerik Üret</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">Üç gerçek ürün görselini seçin; Story, 4:5 ve kare için aynı marka dilinde güvenli bir Remotion render paketi hazırlayın.</p>
          </div>
          <Link href="/admin/reklam-hazirlik" className="rounded-xl border border-[#d6cab8] bg-white px-5 py-3 text-sm font-semibold">Reklam hazırlığına dön</Link>
        </header>
        <ContentStudioClient products={products} />
      </div>
    </main>
  );
}
