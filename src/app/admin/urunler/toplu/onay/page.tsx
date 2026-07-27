import { db, dbYok } from '@/db';
import { catalogProducts } from '@/db/schema';
import { getAdminAuth } from '@/lib/admin-auth';
import { getProductReadiness } from '@/lib/product-readiness';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import BulkReviewClient from './BulkReviewClient';

export const dynamic = 'force-dynamic';

export default async function BulkReviewPage() {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') redirect('/admin/giris');
  const rows = dbYok ? [] : await db.select().from(catalogProducts).orderBy(desc(catalogProducts.updatedAt));
  const products = rows.filter((row) => !row.published).map((row) => {
    const product = { ...row.data, createdAt: new Date(row.data.createdAt), updatedAt: new Date(row.data.updatedAt) };
    return {
      id: row.id,
      name: product.name,
      description: product.description,
      category: product.category,
      collection: product.collection,
      imageCount: getProductReadiness(product).imageCount,
      score: getProductReadiness(product).score,
      ready: getProductReadiness(product).ready,
      copyApproved: product.adChecklist?.copyApproved === true,
    };
  });
  return (
    <main className="min-h-screen bg-[#f6f2eb] px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin/urunler/toplu" className="text-sm text-neutral-600">← Toplu eklemeye dön</Link>
        <h1 className="mt-3 font-heading text-4xl">Toplu Kontrol ve Onay</h1>
        <p className="mt-2 text-sm text-neutral-600">Taslakları kontrol edin, metni onaylayın, reklam kuyruğuna aktarın ve hazır ürünleri yayınlayın.</p>
        <BulkReviewClient products={products} />
      </div>
    </main>
  );
}

