import AdminDashboard from '@/components/admin/AdminDashboard';
import { PRODUCTS } from '@/data/products';
import { db, dbYok } from '@/db';
import { catalogProducts, orders } from '@/db/schema';
import { getAdminAuth } from '@/lib/admin-auth';
import { UserButton } from '@clerk/nextjs';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSelectableFulfillmentStatuses } from '@/lib/order-status';
import { refundOrder, updateOrderStatus } from './actions';

const statusLabels = {
  new: 'Sipariş alındı',
  preparing: 'Hazırlanıyor',
  shipped: 'Kargoya verildi',
  delivered: 'Teslim edildi',
  cancelled: 'İptal edildi',
  returned: 'İade edildi',
} as const;

export const dynamic = 'force-dynamic';

function formatTRY(value: string | number | null) {
  return Number(value ?? 0).toLocaleString('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  });
}

export default async function AdminPage() {
  const admin = await getAdminAuth();
  if (admin.state === 'signed-out') redirect('/admin/giris');

  if (admin.state === 'forbidden') {
    return (
      <main className="mx-auto min-h-[70vh] max-w-xl px-6 py-20 text-center">
        <h1 className="font-heading text-3xl">Bu hesap yetkili değil</h1>
        <p className="mt-4 text-sm text-neutral-600">
          Yönetim paneline yalnızca novella.jewellery.tr@gmail.com ile giriş yapılabilir.
        </p>
        <div className="mt-6 flex justify-center"><UserButton /></div>
      </main>
    );
  }

  const [allOrders, catalogRows] = dbYok
    ? [[], []]
    : await Promise.all([
        db.select().from(orders).orderBy(desc(orders.createdAt)),
        db.select().from(catalogProducts),
      ]);
  const catalogById = new Map(catalogRows.map((row) => [row.id, row]));
  const adminProducts = [
    ...catalogRows.map((row) => ({
      ...row.data,
      createdAt: new Date(row.data.createdAt),
      updatedAt: new Date(row.data.updatedAt),
    })),
    ...PRODUCTS.filter((product) => !catalogById.has(product.id)),
  ];
  const draftProductIds = adminProducts
    .filter((product) => {
      const row = catalogById.get(product.id);
      return row ? !row.published : Boolean(product.hidden);
    })
    .map((product) => product.id);
  const recentOrders = allOrders.slice(0, 100);

  return (
    <main className="min-h-screen bg-[#f6f2eb] px-4 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-9 flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#9e8e63]">Novella</p>
            <h1 className="mt-2 font-heading text-4xl">Yönetim Merkezi</h1>
            <p className="mt-2 text-sm text-neutral-500">
              Satış, sipariş ve ürün operasyonlarını tek ekrandan yönetin.
            </p>
          </div>
          <nav className="flex items-center gap-3" aria-label="Yönetim menüsü">
            <Link href="/" target="_blank" className="rounded-xl border border-[#d8cdbb] bg-white px-4 py-2 text-sm font-medium transition-colors hover:border-black">
              Mağazayı aç
            </Link>
            <Link href="/admin/urunler" className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#9e8e63]">
              Ürünler
            </Link>
            <Link href="/admin/siparisler" className="rounded-xl border border-[#d8cdbb] bg-white px-4 py-2 text-sm font-medium transition-colors hover:border-black">
              Siparişler
            </Link>
            <Link href="/admin/stok" className="rounded-xl border border-[#d8cdbb] bg-white px-4 py-2 text-sm font-medium transition-colors hover:border-black">
              Stok
            </Link>
            <Link href="/admin/guvenlik" className="rounded-xl border border-[#d8cdbb] bg-white px-4 py-2 text-sm font-medium transition-colors hover:border-black">
              Güvenlik
            </Link>
            <Link href="/admin/analitik" className="rounded-xl border border-[#d8cdbb] bg-white px-4 py-2 text-sm font-medium transition-colors hover:border-black">
              Analitik
            </Link>
            <Link href="/admin/reklam-hazirlik" className="rounded-xl border border-[#d8cdbb] bg-white px-4 py-2 text-sm font-medium transition-colors hover:border-black">
              Reklam Hazırlığı
            </Link>
            <Link href="/admin/kampanyalar" className="rounded-xl border border-[#d8cdbb] bg-white px-4 py-2 text-sm font-medium transition-colors hover:border-black">
              Kampanyalar
            </Link>
            <Link href="/admin/icerik-uret" className="rounded-xl border border-[#d8cdbb] bg-white px-4 py-2 text-sm font-medium transition-colors hover:border-black">
              İçerik Üret
            </Link>
            <Link href="/admin/icerik-takvimi" className="rounded-xl border border-[#d8cdbb] bg-white px-4 py-2 text-sm font-medium transition-colors hover:border-black">
              İçerik Takvimi
            </Link>
            <Link href="/admin/mukerrer-urunler" className="rounded-xl border border-[#d8cdbb] bg-white px-4 py-2 text-sm font-medium transition-colors hover:border-black">
              Mükerrer Kontrolü
            </Link>
            <UserButton />
          </nav>
        </header>

        <AdminDashboard
          orders={allOrders}
          products={adminProducts}
          draftProductIds={draftProductIds}
        />

        <section className="mt-10" aria-labelledby="orders-heading">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9e8e63]">Operasyon</p>
              <h2 id="orders-heading" className="mt-2 font-heading text-3xl">Son siparişler</h2>
            </div>
            <p className="text-xs text-neutral-500">Son {Math.min(recentOrders.length, 100)} kayıt</p>
          </div>

          <div className="grid gap-5">
            {recentOrders.map((order) => (
              <article key={order.id} className="rounded-2xl border border-[#e3d9c8] bg-white p-5 shadow-[0_8px_30px_rgba(77,61,35,0.05)]">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{order.orderNo}</h3>
                    <p className="mt-1 text-sm text-neutral-600">
                      {order.customer.adSoyad} · {order.customer.email} · {order.customer.telefon}
                    </p>
                    <p className="mt-1 text-sm text-neutral-500">
                      {new Date(order.createdAt).toLocaleString('tr-TR')} · {formatTRY(order.total)}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${order.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : order.status === 'failed' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                    Ödeme: {order.status}
                  </span>
                </div>

                <div className="mt-4 border-t border-[#eee7dc] pt-4 text-sm text-neutral-700">
                  {order.items.map((item) => (
                    <div key={`${item.productId}-${item.variantId}`}>{item.ad} × {item.adet}</div>
                  ))}
                  <p className="mt-2">{order.customer.adres}, {order.customer.ilce ? `${order.customer.ilce} / ` : ''}{order.customer.il}</p>
                </div>

                <form action={updateOrderStatus} className="mt-5 grid gap-3 border-t border-[#eee7dc] pt-5 md:grid-cols-[1fr_1fr_1fr_auto]">
                  <input type="hidden" name="orderNo" value={order.orderNo} />
                  <select name="fulfillmentStatus" defaultValue={order.fulfillmentStatus} disabled={order.status !== 'paid'} className="rounded-lg border-[#d8cdbb] text-sm disabled:opacity-50">
                    {getSelectableFulfillmentStatuses(order.fulfillmentStatus).map((value) => (
                      <option key={value} value={value}>{statusLabels[value]}</option>
                    ))}
                  </select>
                  <input name="carrier" defaultValue={order.carrier ?? ''} disabled={order.status !== 'paid'} placeholder="Kargo firması (kargoda zorunlu)" className="rounded-lg border-[#d8cdbb] text-sm disabled:opacity-50" />
                  <input name="trackingNumber" defaultValue={order.trackingNumber ?? ''} disabled={order.status !== 'paid'} placeholder="Takip numarası (kargoda zorunlu)" className="rounded-lg border-[#d8cdbb] text-sm disabled:opacity-50" />
                  <button disabled={order.status !== 'paid'} className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40">Kaydet</button>
                </form>

                {order.status === 'paid' && order.refundStatus !== 'success' && (
                  <details className="mt-4 border-t border-[#eee7dc] pt-4">
                    <summary className="cursor-pointer text-sm text-red-700">Tam iade işlemi</summary>
                    <form action={refundOrder} className="mt-3 flex flex-wrap items-center gap-3">
                      <input type="hidden" name="orderNo" value={order.orderNo} />
                      <p className="w-full text-xs text-neutral-500">
                        Bu işlem PayTR üzerinden {formatTRY(order.total)} iade eder ve stoğu geri ekler. Onay için sipariş numarasını yazın.
                      </p>
                      <input name="confirmation" placeholder={order.orderNo} autoComplete="off" className="rounded-lg border-red-200 text-sm" />
                      <button className="rounded-lg bg-red-700 px-5 py-2 text-sm font-medium text-white">İadeyi gerçekleştir</button>
                    </form>
                  </details>
                )}
                {order.refundStatus === 'success' && (
                  <p className="mt-4 border-t border-[#eee7dc] pt-4 text-sm font-medium text-emerald-700">
                    İade tamamlandı: {formatTRY(order.refundAmount)}
                  </p>
                )}
              </article>
            ))}
            {!recentOrders.length && (
              <p className="rounded-2xl border border-[#e3d9c8] bg-white p-8 text-center text-neutral-500">
                Henüz sipariş bulunmuyor. İlk satıştan sonra metrikler otomatik oluşacak.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
