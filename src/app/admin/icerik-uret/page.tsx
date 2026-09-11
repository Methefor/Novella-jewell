import { getAdminAuth } from '@/lib/admin-auth';
import { getCatalogProducts } from '@/lib/catalog';
import { db, dbYok } from '@/db';
import { contentCampaigns, productMediaAssets } from '@/db/schema';
import { SITE } from '@/lib/config';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ContentStudioClient, { type MotionProduct } from './ContentStudioClient';

export const dynamic = 'force-dynamic';

export default async function ContentStudioPage() {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') redirect('/admin/giris');

  const storedMedia = dbYok
    ? []
    : await db
        .select({
          productId: productMediaAssets.productId,
          url: productMediaAssets.url,
          notes: productMediaAssets.notes,
        })
        .from(productMediaAssets)
        .orderBy(desc(productMediaAssets.createdAt))
        .catch((error) => {
          console.error('[admin/icerik-uret] Ürün medya kütüphanesi okunamadı.', error);
          return [];
        });
  const storedMediaByProduct = new Map<
    string,
    { cutouts: string[]; other: string[] }
  >();
  for (const asset of storedMedia) {
    const current = storedMediaByProduct.get(asset.productId) ?? {
      cutouts: [],
      other: [],
    };
    const bucket = asset.notes.startsWith('Remove BG Master')
      ? current.cutouts
      : current.other;
    bucket.push(asset.url);
    storedMediaByProduct.set(asset.productId, current);
  }

  const products: MotionProduct[] = (await getCatalogProducts())
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      category: product.category,
      material: product.material,
      description: product.description,
      story: product.story,
      features: product.features,
      images: Array.from(
        new Set([
          ...(storedMediaByProduct.get(product.id)?.cutouts ?? []),
          ...(product.images?.length
            ? product.images
            : product.variants.flatMap((variant) => variant.images)),
          ...(storedMediaByProduct.get(product.id)?.other ?? []),
        ].filter(Boolean))
      ),
    }))
    .filter((product) => product.images.length > 0);
  const campaigns = dbYok
    ? []
    : await db
        .select({ id: contentCampaigns.id, name: contentCampaigns.name })
        .from(contentCampaigns)
        .orderBy(desc(contentCampaigns.updatedAt));

  return (
    <main className="min-h-screen bg-[#f4efe7] px-4 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <Link href="/admin" className="text-sm text-neutral-600">← Dashboard</Link>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-[#947d4e]">Novella Creative Studio</p>
            <h1 className="mt-2 font-heading text-4xl sm:text-5xl">İçerik Üret</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">Katalogdaki gerçek ürün görsellerini tekrar yüklemeden Product Hero, Packshot, Luxury Ad, Editorial Ad, Scroll Stopper, Luxury Edition ve 3D Billboard briefleri hazırlayın; aynı seçimle storyboard ve Remotion videoları üretin.</p>
          </div>
          <Link href="/admin/reklam-hazirlik" className="rounded-xl border border-[#d6cab8] bg-white px-5 py-3 text-sm font-semibold">Reklam hazırlığına dön</Link>
        </header>
        <ContentStudioClient
          products={products}
          campaigns={campaigns}
          siteUrl={SITE.url}
        />
      </div>
    </main>
  );
}
