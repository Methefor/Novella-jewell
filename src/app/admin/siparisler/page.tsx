import { db, dbYok } from '@/db';
import { orderEvents, orders } from '@/db/schema';
import { getAdminAuth } from '@/lib/admin-auth';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { Download, PackageSearch, Search } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { refundOrder, updateOrderNote, updateOrderStatus } from '../actions';

export const dynamic = 'force-dynamic';

const fulfillmentLabels: Record<string, string> = {
  new: 'Sipariş alındı',
  preparing: 'Hazırlanıyor',
  shipped: 'Kargoya verildi',
  delivered: 'Teslim edildi',
  cancelled: 'İptal edildi',
  returned: 'İade edildi',
};

const paymentLabels: Record<string, string> = {
  pending: 'Ödeme bekliyor',
  paid: 'Ödendi',
  failed: 'Başarısız',
};

function formatTRY(value: string | number | null) {
  return Number(value ?? 0).toLocaleString('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  });
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    payment?: string;
    fulfillment?: string;
    date?: string;
  }>;
}) {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') redirect('/admin/giris');
  const params = await searchParams;
  const query = params.q?.trim().toLocaleLowerCase('tr-TR') ?? '';

  const conditions = [];
  if (params.payment && params.payment !== 'all') {
    conditions.push(eq(orders.status, params.payment));
  }
  if (params.fulfillment && params.fulfillment !== 'all') {
    conditions.push(eq(orders.fulfillmentStatus, params.fulfillment));
  }

  const rows = dbYok
    ? []
    : await db
        .select()
        .from(orders)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(desc(orders.createdAt));
  const dateLimit =
    params.date === '7'
      ? Date.now() - 7 * 86_400_000
      : params.date === '30'
        ? Date.now() - 30 * 86_400_000
        : 0;
  const filtered = rows.filter((order) => {
    if (dateLimit && new Date(order.createdAt).getTime() < dateLimit) return false;
    if (!query) return true;
    return [
      order.orderNo,
      order.customer.adSoyad,
      order.customer.email,
      order.customer.telefon,
      order.trackingNumber ?? '',
    ].some((value) => value.toLocaleLowerCase('tr-TR').includes(query));
  });
  const events =
    !dbYok && filtered.length
      ? await db
          .select()
          .from(orderEvents)
          .where(inArray(orderEvents.orderId, filtered.map((order) => order.id)))
          .orderBy(desc(orderEvents.createdAt))
      : [];
  const eventsByOrder = new Map<string, typeof events>();
  for (const event of events) {
    const list = eventsByOrder.get(event.orderId) ?? [];
    list.push(event);
    eventsByOrder.set(event.orderId, list);
  }
  const exportParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) exportParams.set(key, value);
  });

  return (
    <main className="min-h-screen bg-[#f6f2eb] px-4 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <Link href="/admin" className="text-sm text-neutral-600">
              ← Dashboard
            </Link>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#9e8e63]">
              Operasyon
            </p>
            <h1 className="mt-2 font-heading text-4xl sm:text-5xl">
              Sipariş Merkezi
            </h1>
            <p className="mt-3 text-sm text-neutral-600">
              Sipariş, müşteri, kargo, iade ve operasyon geçmişini yönetin.
            </p>
          </div>
          <a
            href={`/api/admin/orders/export?${exportParams.toString()}`}
            className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white"
          >
            <Download className="h-4 w-4" />
            CSV dışa aktar
          </a>
        </header>

        <form className="mt-8 grid gap-3 rounded-2xl border border-[#e3d9c8] bg-white p-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto]">
          <label className="relative">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-neutral-400" />
            <input
              name="q"
              defaultValue={params.q}
              placeholder="Sipariş no, müşteri, e-posta, telefon…"
              className="w-full rounded-xl border border-[#d8cdbb] py-3 pl-10 pr-4 text-sm"
            />
          </label>
          <select name="payment" defaultValue={params.payment ?? 'all'} className="rounded-xl border-[#d8cdbb] text-sm">
            <option value="all">Tüm ödemeler</option>
            <option value="paid">Ödendi</option>
            <option value="pending">Bekliyor</option>
            <option value="failed">Başarısız</option>
          </select>
          <select name="fulfillment" defaultValue={params.fulfillment ?? 'all'} className="rounded-xl border-[#d8cdbb] text-sm">
            <option value="all">Tüm operasyonlar</option>
            {Object.entries(fulfillmentLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <select name="date" defaultValue={params.date ?? 'all'} className="rounded-xl border-[#d8cdbb] text-sm">
            <option value="all">Tüm tarihler</option>
            <option value="7">Son 7 gün</option>
            <option value="30">Son 30 gün</option>
          </select>
          <button className="rounded-xl bg-[#9e8e63] px-5 py-3 text-sm font-semibold text-white">
            Filtrele
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between text-sm text-neutral-500">
          <span>{filtered.length} sipariş</span>
          {(params.q || params.payment || params.fulfillment || params.date) && (
            <Link href="/admin/siparisler" className="underline">Filtreleri temizle</Link>
          )}
        </div>

        <section className="mt-4 grid gap-4">
          {filtered.map((order) => (
            <article key={order.id} className="rounded-2xl border border-[#e3d9c8] bg-white p-5 shadow-[0_8px_30px_rgba(77,61,35,0.04)]">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">{order.orderNo}</h2>
                  <p className="mt-1 text-sm text-neutral-600">
                    {order.customer.adSoyad} · {order.customer.email} · {order.customer.telefon}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {new Date(order.createdAt).toLocaleString('tr-TR')} · {formatTRY(order.total)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${order.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : order.status === 'failed' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                    {paymentLabels[order.status] ?? order.status}
                  </span>
                  <span className="rounded-full bg-[#f2ede3] px-3 py-1 text-xs font-medium text-neutral-700">
                    {fulfillmentLabels[order.fulfillmentStatus] ?? order.fulfillmentStatus}
                  </span>
                </div>
              </div>

              <details className="mt-5 border-t border-[#eee7dc] pt-4">
                <summary className="cursor-pointer text-sm font-semibold">Sipariş detayını ve işlemleri aç</summary>
                <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1fr]">
                  <div className="space-y-4">
                    <div className="rounded-xl bg-[#f8f5ef] p-4 text-sm">
                      <p className="font-semibold">Ürünler</p>
                      {order.items.map((item) => (
                        <div key={`${item.productId}-${item.variantId}`} className="mt-2 flex justify-between gap-4">
                          <span>{item.ad} × {item.adet}</span>
                          <span>{formatTRY(item.birimFiyat * item.adet)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl bg-[#f8f5ef] p-4 text-sm">
                      <p className="font-semibold">Teslimat</p>
                      <p className="mt-2">{order.customer.adres}</p>
                      <p>{order.customer.ilce ? `${order.customer.ilce} / ` : ''}{order.customer.il}</p>
                      {order.customer.not && <p className="mt-2 text-neutral-500">Müşteri notu: {order.customer.not}</p>}
                    </div>
                    <form action={updateOrderNote}>
                      <input type="hidden" name="orderNo" value={order.orderNo} />
                      <label className="grid gap-2 text-sm font-medium">
                        Operasyon notu
                        <textarea name="operationNote" rows={4} defaultValue={order.operationNote} placeholder="Paketleme, müşteri görüşmesi veya özel durum…" className="rounded-xl border border-[#d8cdbb] p-3 font-normal" />
                      </label>
                      <button className="mt-2 rounded-lg border border-[#d8cdbb] px-4 py-2 text-sm font-medium">Notu kaydet</button>
                    </form>
                  </div>

                  <div>
                    <form action={updateOrderStatus} className="grid gap-3">
                      <input type="hidden" name="orderNo" value={order.orderNo} />
                      <select name="fulfillmentStatus" defaultValue={order.fulfillmentStatus} disabled={order.status !== 'paid'} className="rounded-lg border-[#d8cdbb] text-sm disabled:opacity-50">
                        {Object.entries(fulfillmentLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                      </select>
                      <input name="carrier" defaultValue={order.carrier ?? ''} disabled={order.status !== 'paid'} placeholder="Kargo firması" className="rounded-lg border-[#d8cdbb] text-sm disabled:opacity-50" />
                      <input name="trackingNumber" defaultValue={order.trackingNumber ?? ''} disabled={order.status !== 'paid'} placeholder="Takip numarası" className="rounded-lg border-[#d8cdbb] text-sm disabled:opacity-50" />
                      <button disabled={order.status !== 'paid'} className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white disabled:opacity-40">Durumu kaydet</button>
                    </form>

                    <div className="mt-5 border-t border-[#eee7dc] pt-4">
                      <p className="text-sm font-semibold">İşlem geçmişi</p>
                      <div className="mt-3 space-y-3">
                        {(eventsByOrder.get(order.id) ?? []).map((event) => (
                          <div key={event.id} className="border-l-2 border-[#c9b98e] pl-3 text-xs">
                            <p className="font-medium">
                              {event.eventType === 'fulfillment_status' ? 'Durum değişti' : event.eventType === 'refund' ? 'İade' : 'Operasyon notu'}
                            </p>
                            {(event.fromValue || event.toValue) && (
                              <p className="mt-1 text-neutral-500">{event.fromValue || '—'} → {event.toValue || '—'}</p>
                            )}
                            {event.note && <p className="mt-1 text-neutral-500">{event.note}</p>}
                            <p className="mt-1 text-neutral-400">{new Date(event.createdAt).toLocaleString('tr-TR')} · {event.createdBy}</p>
                          </div>
                        ))}
                        {!(eventsByOrder.get(order.id) ?? []).length && <p className="text-xs text-neutral-400">Henüz yönetici işlemi yok.</p>}
                      </div>
                    </div>

                    {order.status === 'paid' && order.refundStatus !== 'success' && (
                      <details className="mt-5 border-t border-red-100 pt-4">
                        <summary className="cursor-pointer text-sm text-red-700">Tam iade işlemi</summary>
                        <form action={refundOrder} className="mt-3 grid gap-2">
                          <input type="hidden" name="orderNo" value={order.orderNo} />
                          <p className="text-xs text-neutral-500">{formatTRY(order.total)} iade edilir ve stok geri eklenir.</p>
                          <input name="confirmation" placeholder={order.orderNo} autoComplete="off" className="rounded-lg border-red-200 text-sm" />
                          <button className="rounded-lg bg-red-700 px-5 py-2 text-sm font-medium text-white">İadeyi gerçekleştir</button>
                        </form>
                      </details>
                    )}
                  </div>
                </div>
              </details>
            </article>
          ))}
          {!filtered.length && (
            <div className="rounded-2xl border border-dashed border-[#cfc2aa] bg-white p-12 text-center">
              <PackageSearch className="mx-auto h-10 w-10 text-[#9e8e63]" />
              <h2 className="mt-4 font-heading text-2xl">Sipariş bulunamadı</h2>
              <p className="mt-2 text-sm text-neutral-500">Filtreleri değiştirerek tekrar deneyin.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
