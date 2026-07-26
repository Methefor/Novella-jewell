import { UserButton } from '@clerk/nextjs';
import { db, dbYok } from '@/db';
import { orders } from '@/db/schema';
import { getAdminAuth } from '@/lib/admin-auth';
import { desc } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { refundOrder, updateOrderStatus } from './actions';
import Link from 'next/link';

const statusLabels = {
  new: 'Sipariş alındı',
  preparing: 'Hazırlanıyor',
  shipped: 'Kargoya verildi',
  delivered: 'Teslim edildi',
  cancelled: 'İptal edildi',
  returned: 'İade edildi',
} as const;

export const dynamic = 'force-dynamic';

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

  const rows = dbYok
    ? []
    : await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(100);

  return (
    <main className="min-h-screen bg-[#f6f2eb] px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#9e8e63]">Novella</p>
            <h1 className="mt-2 font-heading text-4xl">Sipariş Yönetimi</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/urunler" className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white">Ürünler</Link>
            <UserButton />
          </div>
        </header>

        <div className="grid gap-5">
          {rows.map((order) => (
            <article key={order.id} className="rounded-2xl border border-[#e3d9c8] bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">{order.orderNo}</h2>
                  <p className="mt-1 text-sm text-neutral-600">
                    {order.customer.adSoyad} · {order.customer.email} · {order.customer.telefon}
                  </p>
                  <p className="mt-1 text-sm text-neutral-500">
                    {new Date(order.createdAt).toLocaleString('tr-TR')} · {Number(order.total).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${order.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
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
                  {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
                <input name="carrier" defaultValue={order.carrier ?? ''} disabled={order.status !== 'paid'} placeholder="Kargo firması" className="rounded-lg border-[#d8cdbb] text-sm disabled:opacity-50" />
                <input name="trackingNumber" defaultValue={order.trackingNumber ?? ''} disabled={order.status !== 'paid'} placeholder="Takip numarası" className="rounded-lg border-[#d8cdbb] text-sm disabled:opacity-50" />
                <button disabled={order.status !== 'paid'} className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40">Kaydet</button>
              </form>
              {order.status === 'paid' && order.refundStatus !== 'success' && (
                <details className="mt-4 border-t border-[#eee7dc] pt-4">
                  <summary className="cursor-pointer text-sm text-red-700">Tam iade işlemi</summary>
                  <form action={refundOrder} className="mt-3 flex flex-wrap items-center gap-3">
                    <input type="hidden" name="orderNo" value={order.orderNo} />
                    <p className="w-full text-xs text-neutral-500">
                      Bu işlem PayTR üzerinden {Number(order.total).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })} iade eder ve stoğu geri ekler. Onay için sipariş numarasını yazın.
                    </p>
                    <input name="confirmation" placeholder={order.orderNo} autoComplete="off" className="rounded-lg border-red-200 text-sm" />
                    <button className="rounded-lg bg-red-700 px-5 py-2 text-sm font-medium text-white">İadeyi gerçekleştir</button>
                  </form>
                </details>
              )}
              {order.refundStatus === 'success' && (
                <p className="mt-4 border-t border-[#eee7dc] pt-4 text-sm font-medium text-emerald-700">
                  İade tamamlandı: {Number(order.refundAmount).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                </p>
              )}
            </article>
          ))}
          {!rows.length && <p className="rounded-2xl bg-white p-8 text-center text-neutral-500">Henüz sipariş bulunmuyor.</p>}
        </div>
      </div>
    </main>
  );
}
