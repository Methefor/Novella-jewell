import { db, dbYok } from '@/db';
import { catalogProducts } from '@/db/schema';
import { getAdminAuth } from '@/lib/admin-auth';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ProductsAdminPage() {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') redirect('/admin/giris');
  const rows = dbYok
    ? []
    : await db.select().from(catalogProducts).orderBy(desc(catalogProducts.createdAt));

  return (
    <main className="min-h-screen bg-[#f6f2eb] px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link href="/admin" className="text-sm text-neutral-600">← Siparişler</Link>
            <h1 className="mt-3 font-heading text-4xl">Ürün Yönetimi</h1>
            <p className="mt-2 text-sm text-neutral-500">{rows.length} panel ürünü</p>
          </div>
          <Link href="/admin/urunler/yeni" className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white">Yeni ürün ekle</Link>
        </header>
        <div className="grid gap-4">
          {rows.map(({ id, data, published }) => (
            <article key={id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#e3d9c8] bg-white p-5">
              <div>
                <h2 className="font-semibold">{data.name}</h2>
                <p className="mt-1 text-sm text-neutral-500">{data.slug} · {data.price.toLocaleString('tr-TR')} ₺ · stok {data.variants[0]?.stock ?? 0}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs ${published ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100'}`}>{published ? 'Yayında' : 'Taslak'}</span>
                <Link href={`/urun/${data.slug}`} target="_blank" className="text-sm underline">Görüntüle</Link>
              </div>
            </article>
          ))}
          {!rows.length && <p className="rounded-2xl bg-white p-8 text-center text-neutral-500">Panelden eklenmiş ürün henüz yok.</p>}
        </div>
      </div>
    </main>
  );
}
