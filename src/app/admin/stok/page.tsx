import { PRODUCTS } from '@/data/products';
import { db, dbYok } from '@/db';
import { catalogProducts, inventory, stockMovements } from '@/db/schema';
import { getAdminAuth } from '@/lib/admin-auth';
import type { Product } from '@/types/product';
import { desc } from 'drizzle-orm';
import { AlertTriangle, Boxes, History, PackageX, Search } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { adjustStock } from './actions';

export const dynamic = 'force-dynamic';

const colorLabels: Record<string, string> = {
  altin: 'Altın',
  gumus: 'Gümüş',
  'rose-gold': 'Rose Gold',
  siyah: 'Siyah',
  beyaz: 'Beyaz',
  'cok-renkli': 'Çok renkli',
};

export default async function StockPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') redirect('/admin/giris');
  const params = await searchParams;
  const [catalogRows, inventoryRows, movementRows] = dbYok
    ? [[], [], []]
    : await Promise.all([
        db.select().from(catalogProducts),
        db.select().from(inventory),
        db.select().from(stockMovements).orderBy(desc(stockMovements.createdAt)).limit(100),
      ]);
  const catalogIds = new Set(catalogRows.map((row) => row.id));
  const products: Product[] = [
    ...catalogRows.map((row) => ({
      ...row.data,
      createdAt: new Date(row.data.createdAt),
      updatedAt: new Date(row.data.updatedAt),
    })),
    ...PRODUCTS.filter((product) => !catalogIds.has(product.id)),
  ];
  const productById = new Map(products.map((product) => [product.id, product]));
  const inventoryByVariant = new Map(
    inventoryRows.map((row) => [`${row.productId}:${row.variantId}`, row])
  );
  const variants = products.flatMap((product) =>
    product.variants.map((variant) => {
      const stored = inventoryByVariant.get(`${product.id}:${variant.id}`);
      return {
        product,
        variant,
        stock: stored?.stock ?? variant.stock,
        threshold: stored?.lowStockThreshold ?? 3,
        updatedAt: stored?.updatedAt ?? product.updatedAt,
      };
    })
  );
  const query = params.q?.trim().toLocaleLowerCase('tr-TR') ?? '';
  const filtered = variants.filter((row) => {
    if (
      query &&
      ![row.product.name, row.product.id, colorLabels[row.variant.color] ?? row.variant.color]
        .some((value) => value.toLocaleLowerCase('tr-TR').includes(query))
    ) return false;
    if (params.status === 'out') return row.stock === 0;
    if (params.status === 'low') return row.stock > 0 && row.stock <= row.threshold;
    if (params.status === 'healthy') return row.stock > row.threshold;
    return true;
  });
  const outCount = variants.filter((row) => row.stock === 0).length;
  const lowCount = variants.filter((row) => row.stock > 0 && row.stock <= row.threshold).length;
  const totalStock = variants.reduce((sum, row) => sum + row.stock, 0);

  return (
    <main className="min-h-screen bg-[#f6f2eb] px-4 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <Link href="/admin" className="text-sm text-neutral-600">← Dashboard</Link>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#9e8e63]">Envanter</p>
            <h1 className="mt-2 font-heading text-4xl sm:text-5xl">Stok Merkezi</h1>
            <p className="mt-3 text-sm text-neutral-600">Varyant stoklarını, kritik seviyeleri ve tüm hareketleri izleyin.</p>
          </div>
          <Link href="/admin/urunler" className="rounded-xl border border-[#d8cdbb] bg-white px-5 py-3 text-sm font-medium">Ürünleri yönet</Link>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Toplam stok', value: totalStock, icon: Boxes, tone: 'text-[#8d7c55]' },
            { label: 'Kritik stok', value: lowCount, icon: AlertTriangle, tone: 'text-amber-700' },
            { label: 'Stokta yok', value: outCount, icon: PackageX, tone: 'text-rose-700' },
          ].map((card) => (
            <article key={card.label} className="rounded-2xl border border-[#e3d9c8] bg-white p-5">
              <card.icon className={`h-5 w-5 ${card.tone}`} />
              <p className="mt-4 text-xs text-neutral-500">{card.label}</p>
              <p className="mt-1 text-3xl font-semibold">{card.value}</p>
            </article>
          ))}
        </section>

        <form className="mt-6 grid gap-3 rounded-2xl border border-[#e3d9c8] bg-white p-4 md:grid-cols-[1fr_240px_auto]">
          <label className="relative">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-neutral-400" />
            <input name="q" defaultValue={params.q} placeholder="Ürün, varyant veya ürün ID ara…" className="w-full rounded-xl border border-[#d8cdbb] py-3 pl-10 pr-4 text-sm" />
          </label>
          <select name="status" defaultValue={params.status ?? 'all'} className="rounded-xl border-[#d8cdbb] text-sm">
            <option value="all">Tüm stoklar</option>
            <option value="low">Kritik stok</option>
            <option value="out">Stokta yok</option>
            <option value="healthy">Sağlıklı stok</option>
          </select>
          <button className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white">Filtrele</button>
        </form>

        <section className="mt-5 grid gap-4">
          {filtered.map(({ product, variant, stock, threshold, updatedAt }) => {
            const isOut = stock === 0;
            const isLow = stock > 0 && stock <= threshold;
            return (
              <article key={`${product.id}:${variant.id}`} className="rounded-2xl border border-[#e3d9c8] bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="font-heading text-2xl">{product.name}</h2>
                    <p className="mt-1 text-xs text-neutral-500">{colorLabels[variant.color] ?? variant.color} · {variant.id} · Güncelleme {new Date(updatedAt).toLocaleString('tr-TR')}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${isOut ? 'bg-rose-100 text-rose-800' : isLow ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {isOut ? 'Stokta yok' : isLow ? `Kritik · ${stock} adet` : `${stock} adet`}
                  </span>
                </div>
                <details className="mt-4 border-t border-[#eee7dc] pt-4">
                  <summary className="cursor-pointer text-sm font-semibold">Stok düzeltmesi yap</summary>
                  <form action={adjustStock} className="mt-4 grid gap-3 lg:grid-cols-[120px_160px_1fr_auto]">
                    <input type="hidden" name="productId" value={product.id} />
                    <input type="hidden" name="variantId" value={variant.id} />
                    <input type="hidden" name="currentStock" value={stock} />
                    <label className="grid gap-1 text-xs text-neutral-500">Yeni stok<input required name="newStock" type="number" min="0" defaultValue={stock} className="rounded-lg border-[#d8cdbb] text-sm text-black" /></label>
                    <label className="grid gap-1 text-xs text-neutral-500">Kritik eşik<input required name="lowStockThreshold" type="number" min="0" defaultValue={threshold} className="rounded-lg border-[#d8cdbb] text-sm text-black" /></label>
                    <label className="grid gap-1 text-xs text-neutral-500">Düzeltme nedeni<input required name="reason" minLength={3} placeholder="Sayım farkı, yeni ürün girişi…" className="rounded-lg border-[#d8cdbb] text-sm text-black" /></label>
                    <button className="self-end rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white">Stoğu kaydet</button>
                  </form>
                </details>
              </article>
            );
          })}
        </section>

        <section className="mt-8 rounded-2xl border border-[#e3d9c8] bg-white p-5">
          <div className="flex items-center gap-3"><History className="h-5 w-5 text-[#9e8e63]" /><h2 className="font-heading text-2xl">Son stok hareketleri</h2></div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-[#e8dfd0] text-xs text-neutral-500"><tr><th className="pb-3">Tarih</th><th className="pb-3">Ürün</th><th className="pb-3">Kaynak</th><th className="pb-3">Değişim</th><th className="pb-3">Stok</th><th className="pb-3">Neden / Referans</th></tr></thead>
              <tbody>
                {movementRows.map((movement) => (
                  <tr key={movement.id} className="border-b border-[#f0eadf]">
                    <td className="py-3 text-xs text-neutral-500">{new Date(movement.createdAt).toLocaleString('tr-TR')}</td>
                    <td className="py-3 font-medium">{productById.get(movement.productId)?.name ?? movement.productId}</td>
                    <td className="py-3">{movement.source}</td>
                    <td className={`py-3 font-semibold ${movement.delta > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>{movement.delta > 0 ? '+' : ''}{movement.delta}</td>
                    <td className="py-3">{movement.previousStock} → {movement.newStock}</td>
                    <td className="py-3 text-neutral-600">{movement.reason}{movement.reference ? ` · ${movement.reference}` : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!movementRows.length && <p className="py-8 text-center text-sm text-neutral-500">İlk stok değişikliğinden sonra hareketler burada görünecek.</p>}
          </div>
        </section>
      </div>
    </main>
  );
}
