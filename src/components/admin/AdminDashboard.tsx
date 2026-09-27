import type { OrderRow } from '@/db/schema';
import type { Product } from '@/types/product';
import { AreaChart, GlassCard, StatCard } from '@/components/admin/analytics/DashboardWidgets';
import { computeOrderMetrics } from '@/lib/admin-metrics';
import { periodDelta } from '@/lib/analytics-dashboard';
import { getProductReadiness } from '@/lib/product-readiness';
import { CircleDollarSign, Clock3, PackageCheck, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

function formatTRY(value: number, compact = false) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: compact ? 1 : 2,
  }).format(value);
}

/** Tutar kartları ondalık tutabildiği için sayaç yerine biçimlenmiş metin gösterir. */
function MoneyCard({ label, value, note, icon, delay }: { label: string; value: string; note: string; icon: ReactNode; delay: number }) {
  return (
    <GlassCard delay={delay}>
      <div className="grid h-10 w-10 place-items-center rounded-[13px] bg-gradient-to-br from-[#e7d3a4] to-[#c5a46d] text-white">{icon}</div>
      <p className="mt-4 text-xs text-[#7b7466]">{label}</p>
      <p className="mt-0.5 text-3xl font-semibold tracking-tight">{value}</p>
      <span className="mt-2 inline-flex rounded-full bg-[#ece7dc] px-2.5 py-0.5 text-xs font-semibold text-[#7b7466]">{note}</span>
    </GlassCard>
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
  const metrics = computeOrderMetrics(orders, now);
  const dayLabel = new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'short' });
  const chartPoints = metrics.daily.map((day) => ({ label: dayLabel.format(day.date), value: day.revenue }));
  const chartText = metrics.daily.map((day) => `${formatTRY(day.revenue)} · ${day.count} sipariş`);
  const maxQuantity = Math.max(...metrics.topProducts.map((item) => item.quantity), 1);
  const totalFlow = Math.max(metrics.realCount, 1);

  const readiness = products.map((product) => ({ product, status: getProductReadiness(product) }));
  const readyProducts = readiness.filter(({ status }) => status.ready);
  const missingVisuals = readiness.filter(({ status }) => status.imageCount < 3);
  const draftIds = new Set(draftProductIds);
  const excludedNote = metrics.excludedCount > 0 ? `${metrics.excludedCount} test/iade hariç` : 'Onaylanmış ödemeler';
  const weekDelta = periodDelta(metrics.weekRevenue, metrics.previousWeekRevenue);
  const weekDeltaText = weekDelta.pct == null
    ? ''
    : ` · ${weekDelta.pct > 0 ? '▲' : weekDelta.pct < 0 ? '▼' : ''}%${Math.abs(weekDelta.pct).toLocaleString('tr-TR', { maximumFractionDigits: 1 })}`;

  return (
    <section className="space-y-4" aria-labelledby="dashboard-heading">
      <h2 id="dashboard-heading" className="sr-only">İşletme özeti</h2>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MoneyCard label="Toplam ciro" value={formatTRY(metrics.revenue)} note={excludedNote} icon={<CircleDollarSign className="h-5 w-5" />} delay={0.05} />
        <StatCard label="Gerçek sipariş" value={metrics.realCount} icon={<ShoppingBag className="h-5 w-5" />} delta={periodDelta(metrics.weekCount, metrics.previousWeekCount)} delay={0.1} />
        <MoneyCard label="Ortalama sepet" value={formatTRY(metrics.averageOrder)} note="Sipariş başına gelir" icon={<PackageCheck className="h-5 w-5" />} delay={0.15} />
        <StatCard label="Operasyon bekleyen" value={metrics.pendingOperations} dark icon={<Clock3 className="h-5 w-5" />} note="Hazırlama veya kargo" delay={0.2} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <GlassCard delay={0.25}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-heading text-[26px]">14 günlük ciro</h3>
              <p className="mt-1 text-xs text-[#7b7466]">Günlük gerçek satış (test ve iade hariç)</p>
            </div>
            <p className="text-sm font-semibold">{formatTRY(metrics.weekRevenue)} <span className="text-xs font-normal text-[#7b7466]">bu hafta{weekDeltaText}</span></p>
          </div>
          <AreaChart points={chartPoints} formatted={chartText} unit="ciro" />
        </GlassCard>

        <GlassCard delay={0.3} className="!border-[#2a2a22] !bg-gradient-to-br !from-[#1d1d17] !to-[#0f0f0c] text-white">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#cdbc91]">Operasyon</p>
          <h3 className="mt-2 font-heading text-[26px] text-white">Sipariş akışı</h3>
          <div className="mt-6 space-y-5">
            {([['Hazırlanıyor', metrics.fulfillment.preparing], ['Kargoda', metrics.fulfillment.shipped], ['Teslim edildi', metrics.fulfillment.delivered]] as const).map(([label, value]) => (
              <div key={label}>
                <div className="flex items-center justify-between text-sm"><span className="text-white/65">{label}</span><span className="font-semibold">{value}</span></div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#cdbc91]" style={{ width: `${Math.max((value / totalFlow) * 100, value ? 5 : 0)}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="mt-7 rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs text-white/50">Bu hafta</p>
            <p className="mt-1 text-xl font-semibold">{metrics.weekCount} sipariş</p>
            <p className="mt-1 text-xs text-white/45">{formatTRY(metrics.weekRevenue)} gerçek ciro</p>
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <GlassCard delay={0.35}>
          <div className="flex items-end justify-between gap-3">
            <div><h3 className="font-heading text-[26px]">En çok satanlar</h3><p className="mt-1 text-xs text-[#7b7466]">Gerçek satışlarda ürün adedi</p></div>
            <span className="text-xs text-[#7b7466]">İlk 5</span>
          </div>
          <div className="mt-5 space-y-4">
            {metrics.topProducts.map((product, index) => (
              <div key={product.name} className="grid grid-cols-[24px_1fr_auto] items-center gap-3">
                <span className="text-xs font-semibold text-[#9e8e63]">{String(index + 1).padStart(2, '0')}</span>
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-3"><p className="truncate text-sm font-medium">{product.name}</p><p className="shrink-0 text-xs text-[#7b7466]">{product.quantity} adet</p></div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#f0ebe2]"><div className="h-full rounded-full bg-gradient-to-r from-[#9e8e63] to-[#d9c38f]" style={{ width: `${(product.quantity / maxQuantity) * 100}%` }} /></div>
                </div>
                <span className="hidden min-w-24 text-right text-xs font-semibold sm:block">{formatTRY(product.revenue, true)}</span>
              </div>
            ))}
            {!metrics.topProducts.length && <p className="rounded-xl bg-white/55 p-6 text-center text-sm text-[#7b7466]">İlk gerçek satıştan sonra ürün performansı burada görünecek.</p>}
          </div>
        </GlassCard>

        <GlassCard delay={0.4}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-heading text-[26px]">Ürün içerik durumu</h3>
              <p className="mt-1 text-xs text-[#7b7466]">Görsel, açıklama, özellik, fiyat ve stok kontrolleri</p>
            </div>
            <Link href="/admin/reklam-hazirlik" className="rounded-full bg-[#171713] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#9e8e63]">Hazırlık merkezi</Link>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {([['Toplam ürün', products.length], ['Reklama hazır', readyProducts.length], ['Eksik görselli', missingVisuals.length], ['Mağaza taslağı', draftIds.size]] as const).map(([label, value]) => (
              <div key={label} className="rounded-[14px] bg-white/55 p-4">
                <p className="text-xs text-[#7b7466]">{label}</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
              </div>
            ))}
          </div>
          {missingVisuals.length > 0 && (
            <div className="mt-4 rounded-[14px] border border-amber-200 bg-amber-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Öncelikli görsel işleri</p>
              <p className="mt-2 text-[13px] text-amber-900">
                {missingVisuals.slice(0, 5).map(({ product, status }) => `${product.name} (${status.imageCount}/3)`).join(' · ')}
                {missingVisuals.length > 5 ? ` · +${missingVisuals.length - 5} ürün` : ''}
              </p>
            </div>
          )}
        </GlassCard>
      </div>
    </section>
  );
}
