import type { OrderRow } from '@/db/schema';
import type { Product } from '@/types/product';
import { getProductReadiness } from '@/lib/product-readiness';
import Link from 'next/link';
import {
  ArrowDownRight,
  ArrowUpRight,
  CircleDollarSign,
  Clock3,
  PackageCheck,
  ShoppingBag,
} from 'lucide-react';

const DAY_MS = 86_400_000;

function formatTRY(value: number, compact = false) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: compact ? 1 : 2,
  }).format(value);
}

function startOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function percentChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

function ChangeBadge({ value }: { value: number }) {
  const positive = value >= 0;
  const Icon = positive ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${positive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
      <Icon className="h-3 w-3" />
      %{Math.abs(value).toLocaleString('tr-TR', { maximumFractionDigits: 1 })}
    </span>
  );
}

export default function AdminDashboard({
  orders,
  products,
  draftProductIds,
}: {
  orders: OrderRow[];
  products: Product[];
  draftProductIds: string[];
}) {
  const now = new Date();
  const today = startOfDay(now);
  const sevenDaysAgo = new Date(today.getTime() - 6 * DAY_MS);
  const fourteenDaysAgo = new Date(today.getTime() - 13 * DAY_MS);
  const paid = orders.filter((order) => order.status === 'paid');
  const currentPaid = paid.filter((order) => new Date(order.createdAt) >= sevenDaysAgo);
  const previousPaid = paid.filter((order) => {
    const created = new Date(order.createdAt);
    return created >= fourteenDaysAgo && created < sevenDaysAgo;
  });
  const revenue = paid.reduce((sum, order) => sum + Number(order.total), 0);
  const currentRevenue = currentPaid.reduce((sum, order) => sum + Number(order.total), 0);
  const previousRevenue = previousPaid.reduce((sum, order) => sum + Number(order.total), 0);
  const averageOrder = paid.length ? revenue / paid.length : 0;
  const pendingOperations = paid.filter(
    (order) => !['delivered', 'cancelled', 'returned'].includes(order.fulfillmentStatus)
  ).length;

  const daily = Array.from({ length: 14 }, (_, index) => {
    const date = new Date(fourteenDaysAgo.getTime() + index * DAY_MS);
    const next = new Date(date.getTime() + DAY_MS);
    const dayOrders = paid.filter((order) => {
      const created = new Date(order.createdAt);
      return created >= date && created < next;
    });
    return {
      label: new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'short' }).format(date),
      value: dayOrders.reduce((sum, order) => sum + Number(order.total), 0),
    };
  });
  const maxDaily = Math.max(...daily.map((day) => day.value), 1);

  const productSales = new Map<string, { name: string; quantity: number; revenue: number }>();
  for (const order of paid) {
    for (const item of order.items) {
      const product = productSales.get(item.productId) ?? { name: item.ad, quantity: 0, revenue: 0 };
      product.quantity += item.adet;
      product.revenue += item.birimFiyat * item.adet;
      productSales.set(item.productId, product);
    }
  }
  const topProducts = [...productSales.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 5);
  const maxQuantity = Math.max(...topProducts.map((item) => item.quantity), 1);

  const fulfillment = [
    ['Hazırlanıyor', paid.filter((order) => order.fulfillmentStatus === 'preparing').length],
    ['Kargoda', paid.filter((order) => order.fulfillmentStatus === 'shipped').length],
    ['Teslim edildi', paid.filter((order) => order.fulfillmentStatus === 'delivered').length],
  ] as const;

  const cards = [
    { label: 'Toplam ciro', value: formatTRY(revenue), note: 'Onaylanmış ödemeler', icon: CircleDollarSign, change: percentChange(currentRevenue, previousRevenue) },
    { label: 'Siparişler', value: paid.length.toLocaleString('tr-TR'), note: 'Başarılı sipariş', icon: ShoppingBag, change: percentChange(currentPaid.length, previousPaid.length) },
    { label: 'Ortalama sepet', value: formatTRY(averageOrder), note: 'Sipariş başına gelir', icon: PackageCheck },
    { label: 'Operasyon bekleyen', value: pendingOperations.toLocaleString('tr-TR'), note: 'Hazırlama veya kargo', icon: Clock3 },
  ];
  const readiness = products.map((product) => ({
    product,
    status: getProductReadiness(product),
  }));
  const readyProducts = readiness.filter(({ status }) => status.ready);
  const missingVisuals = readiness.filter(({ status }) => status.imageCount < 3);
  const draftIds = new Set(draftProductIds);

  return (
    <section className="space-y-6" aria-labelledby="dashboard-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9e8e63]">Genel bakış</p>
          <h2 id="dashboard-heading" className="mt-2 font-heading text-3xl">İşletme özeti</h2>
        </div>
        <p className="text-xs text-neutral-500">Son güncelleme {now.toLocaleString('tr-TR')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.label} className="rounded-2xl border border-[#e3d9c8] bg-white p-5 shadow-[0_8px_30px_rgba(77,61,35,0.05)]">
              <div className="flex items-start justify-between gap-4">
                <div className="rounded-xl bg-[#f6f2eb] p-2.5 text-[#8d7c55]"><Icon className="h-5 w-5" strokeWidth={1.7} /></div>
                {'change' in card && typeof card.change === 'number' && <ChangeBadge value={card.change} />}
              </div>
              <p className="mt-6 text-xs font-medium text-neutral-500">{card.label}</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">{card.value}</p>
              <p className="mt-2 text-xs text-neutral-400">{card.note}</p>
            </article>
          );
        })}
      </div>

      <article className="rounded-2xl border border-[#e3d9c8] bg-white p-5 shadow-[0_8px_30px_rgba(77,61,35,0.05)] sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9e8e63]">
              Reklam hazırlığı
            </p>
            <h3 className="mt-2 font-heading text-3xl">Ürün içerik durumu</h3>
            <p className="mt-2 text-sm text-neutral-500">
              Ürün görseli, açıklama, özellik, fiyat ve stok kontrolleri
            </p>
          </div>
          <Link
            href="/admin/reklam-hazirlik"
            className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white"
          >
            Hazırlık merkezini aç
          </Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          {[
            ['Toplam ürün', products.length],
            ['Reklama hazır', readyProducts.length],
            ['Eksik görselli', missingVisuals.length],
            ['Mağaza taslağı', draftIds.size],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-[#f8f5ef] p-4">
              <p className="text-xs text-neutral-500">{label}</p>
              <p className="mt-1 text-2xl font-semibold">{value}</p>
            </div>
          ))}
        </div>
        {missingVisuals.length > 0 && (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
              Öncelikli görsel işleri
            </p>
            <p className="mt-2 text-sm text-amber-900">
              {missingVisuals
                .slice(0, 5)
                .map(({ product, status }) => `${product.name} (${status.imageCount}/3)`)
                .join(' · ')}
              {missingVisuals.length > 5
                ? ` · +${missingVisuals.length - 5} ürün`
                : ''}
            </p>
          </div>
        )}
      </article>

      <div className="grid gap-5 xl:grid-cols-[1.55fr_0.85fr]">
        <article className="rounded-2xl border border-[#e3d9c8] bg-white p-5 shadow-[0_8px_30px_rgba(77,61,35,0.05)] sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><h3 className="font-sans text-sm font-semibold">14 günlük ciro</h3><p className="mt-1 text-xs text-neutral-500">Günlük onaylanmış ödeme toplamı</p></div>
            <p className="text-sm font-semibold">{formatTRY(currentRevenue)}</p>
          </div>
          <div className="mt-8 flex h-52 items-end gap-1.5 sm:gap-2">
            {daily.map((day, index) => (
              <div key={`${day.label}-${index}`} className="group flex min-w-0 flex-1 flex-col items-center justify-end gap-2">
                <div className="relative flex h-40 w-full items-end">
                  <div className="w-full rounded-t-md bg-gradient-to-t from-[#9e8e63] to-[#d9ccaa] transition-all group-hover:from-black group-hover:to-[#9e8e63]" style={{ height: `${Math.max((day.value / maxDaily) * 100, day.value ? 8 : 2)}%` }} title={`${day.label}: ${formatTRY(day.value)}`} />
                </div>
                <span className={`text-[9px] text-neutral-400 ${index % 2 ? 'hidden sm:block' : ''}`}>{day.label}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-[#e3d9c8] bg-[#171713] p-5 text-white shadow-[0_8px_30px_rgba(30,25,16,0.12)] sm:p-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#cdbc91]">Operasyon</p>
          <h3 className="mt-2 font-heading text-3xl text-white">Sipariş akışı</h3>
          <div className="mt-7 space-y-5">
            {fulfillment.map(([label, value]) => (
              <div key={label}>
                <div className="flex items-center justify-between text-sm"><span className="text-white/65">{label}</span><span className="font-semibold">{value}</span></div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#cdbc91]" style={{ width: `${Math.max(paid.length ? (value / paid.length) * 100 : 0, value ? 5 : 0)}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs text-white/50">Bu hafta</p>
            <p className="mt-1 text-xl font-semibold">{currentPaid.length} sipariş</p>
            <p className="mt-1 text-xs text-white/45">{formatTRY(currentRevenue)} onaylanmış ciro</p>
          </div>
        </article>
      </div>

      <article className="rounded-2xl border border-[#e3d9c8] bg-white p-5 shadow-[0_8px_30px_rgba(77,61,35,0.05)] sm:p-6">
        <div className="flex items-end justify-between gap-3">
          <div><h3 className="font-sans text-sm font-semibold">En çok satanlar</h3><p className="mt-1 text-xs text-neutral-500">Ödenmiş siparişlerde ürün adedi</p></div>
          <span className="text-xs text-neutral-400">İlk 5</span>
        </div>
        <div className="mt-6 space-y-4">
          {topProducts.map((product, index) => (
            <div key={product.name} className="grid grid-cols-[24px_1fr_auto] items-center gap-3">
              <span className="text-xs font-semibold text-[#9e8e63]">{String(index + 1).padStart(2, '0')}</span>
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-3"><p className="truncate text-sm font-medium">{product.name}</p><p className="shrink-0 text-xs text-neutral-500">{product.quantity} adet</p></div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#f0ebe2]"><div className="h-full rounded-full bg-[#b8a574]" style={{ width: `${(product.quantity / maxQuantity) * 100}%` }} /></div>
              </div>
              <span className="hidden min-w-24 text-right text-xs font-semibold sm:block">{formatTRY(product.revenue, true)}</span>
            </div>
          ))}
          {!topProducts.length && <p className="rounded-xl bg-[#f8f5ef] p-6 text-center text-sm text-neutral-500">Satış verisi oluştuğunda ürün performansı burada görünecek.</p>}
        </div>
      </article>
    </section>
  );
}
