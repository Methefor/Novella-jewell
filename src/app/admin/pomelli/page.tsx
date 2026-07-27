import { PRODUCTS } from '@/data/products';
import { db, dbYok } from '@/db';
import { catalogProducts, productMediaAssets } from '@/db/schema';
import { getAdminAuth } from '@/lib/admin-auth';
import { desc } from 'drizzle-orm';
import { CheckCircle2, ImageIcon, ShieldAlert } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  addPomelliAssetToGallery,
  reviewPomelliAsset,
} from './actions';
import PomelliUploader from './PomelliUploader';

export const dynamic = 'force-dynamic';

const kindLabels = {
  studio: 'Stüdyo',
  model: 'Model üzerinde',
  lifestyle: 'Lifestyle / mekân',
  campaign: 'Reklam kreatifi',
};

export default async function PomelliPage() {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') redirect('/admin/giris');
  const [catalogRows, assets] = dbYok
    ? [[], []]
    : await Promise.all([
        db.select().from(catalogProducts),
        db
          .select()
          .from(productMediaAssets)
          .orderBy(desc(productMediaAssets.createdAt))
          .limit(100),
      ]);
  const catalogIds = new Set(catalogRows.map((row) => row.id));
  const products = [
    ...catalogRows.map((row) => ({
      id: row.id,
      name: row.data.name,
      slug: row.slug,
      images: row.data.images ?? [],
    })),
    ...PRODUCTS.filter((product) => !catalogIds.has(product.id)).map(
      (product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        images: product.images ?? [],
      })
    ),
  ].sort((a, b) => a.name.localeCompare(b.name, 'tr'));
  const productById = new Map(products.map((product) => [product.id, product]));
  const approvedCount = assets.filter((asset) =>
    ['approved', 'gallery'].includes(asset.status)
  ).length;

  return (
    <main className="min-h-screen bg-[#f6f2eb] px-4 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <header>
          <Link href="/admin" className="text-sm text-neutral-600">
            ← Dashboard
          </Link>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#9e8e63]">
            Ürün çekim operasyonu
          </p>
          <h1 className="mt-2 font-heading text-4xl sm:text-5xl">
            Pomelli Çekim Merkezi
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-600">
            Orijinal ürün fotoğrafını Pomelli ile stüdyo, model ve lifestyle
            sahnelerine taşıyın; sonuçları ürün biçimi, renk ve detay açısından
            doğrulamadan mağazaya aktarmayın.
          </p>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#e3d9c8] bg-white p-5">
            <ImageIcon className="h-5 w-5 text-[#9e8e63]" />
            <p className="mt-4 text-xs text-neutral-500">Toplam çekim</p>
            <p className="mt-1 text-3xl font-semibold">{assets.length}</p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <ShieldAlert className="h-5 w-5 text-amber-700" />
            <p className="mt-4 text-xs text-amber-800">İnceleme bekleyen</p>
            <p className="mt-1 text-3xl font-semibold">
              {assets.filter((asset) => asset.status === 'review').length}
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <CheckCircle2 className="h-5 w-5 text-emerald-700" />
            <p className="mt-4 text-xs text-emerald-800">Onaylı / galeride</p>
            <p className="mt-1 text-3xl font-semibold">{approvedCount}</p>
          </div>
        </section>

        <div className="mt-6">
          <PomelliUploader products={products} />
        </div>

        <section className="mt-8">
          <h2 className="font-heading text-3xl">Çekim inceleme kuyruğu</h2>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {assets.map((asset) => {
              const product = productById.get(asset.productId);
              const fullyApproved =
                asset.formApproved &&
                asset.colorApproved &&
                asset.detailApproved;
              return (
                <article
                  key={asset.id}
                  className="overflow-hidden rounded-2xl border border-[#e3d9c8] bg-white"
                >
                  <div className="grid sm:grid-cols-[220px_1fr]">
                    <div className="relative aspect-square bg-[#eee9e0]">
                      <Image
                        src={asset.url}
                        alt={`${product?.name ?? 'Ürün'} Pomelli çekimi`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 220px"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="font-heading text-2xl">
                            {product?.name ?? asset.productId}
                          </h3>
                          <p className="mt-1 text-xs text-neutral-500">
                            {new Date(asset.createdAt).toLocaleString('tr-TR')}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            asset.status === 'gallery'
                              ? 'bg-black text-white'
                              : fullyApproved
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {asset.status === 'gallery'
                            ? 'Galeride'
                            : fullyApproved
                              ? 'Onaylı'
                              : 'İncelemede'}
                        </span>
                      </div>

                      <form action={reviewPomelliAsset} className="mt-5 grid gap-3">
                        <input type="hidden" name="assetId" value={asset.id} />
                        <select
                          name="kind"
                          defaultValue={asset.kind}
                          className="rounded-xl border-[#d8cdbb] text-sm"
                        >
                          {Object.entries(kindLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                        {[
                          ['formApproved', 'Ürünün biçimi ve oranları değişmemiş'],
                          ['colorApproved', 'Renk ve kaplama gerçek ürünle aynı'],
                          ['detailApproved', 'Taş, bağlantı ve yüzey detayları doğru'],
                        ].map(([name, label]) => (
                          <label
                            key={name}
                            className="flex items-start gap-2 text-sm"
                          >
                            <input
                              type="checkbox"
                              name={name}
                              defaultChecked={
                                name === 'formApproved'
                                  ? asset.formApproved
                                  : name === 'colorApproved'
                                    ? asset.colorApproved
                                    : asset.detailApproved
                              }
                              className="mt-0.5 rounded"
                            />
                            {label}
                          </label>
                        ))}
                        <textarea
                          name="notes"
                          rows={2}
                          defaultValue={asset.notes}
                          placeholder="Varsa fark veya kullanım notu…"
                          className="rounded-xl border-[#d8cdbb] p-3 text-sm"
                        />
                        <button className="rounded-lg border border-[#b9a679] bg-[#faf7f1] px-4 py-2.5 text-sm font-medium text-[#6f5d36]">
                          İncelemeyi kaydet
                        </button>
                      </form>

                      {asset.status === 'approved' && (
                        <form action={addPomelliAssetToGallery} className="mt-3">
                          <input type="hidden" name="assetId" value={asset.id} />
                          <button className="w-full rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white">
                            Ürün galerisine ekle
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
            {!assets.length && (
              <p className="rounded-2xl border border-dashed border-[#cfc2aa] bg-white p-10 text-center text-sm text-neutral-500 lg:col-span-2">
                İlk Pomelli çekimlerini yüklediğinizde inceleme kuyruğu burada
                oluşacak.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
