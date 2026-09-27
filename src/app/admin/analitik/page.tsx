// LEGACY (yalnızca analitik etiket çözümleme, salt okunur): src/data/products.ts katalog kaynağı DEĞİLDİR (ADR-013).
// Eski analitik olaylarındaki ürün kimliklerini okunabilir isme çevirmek için kullanılır;
// vitrini, siparişi, stoğu veya fiyatı etkilemez ve hiçbir şey yazmaz.
import { PRODUCTS as LEGACY_PRODUCT_NAMES } from '@/data/products';
import AdminFrame from '@/components/admin/AdminFrame';
import { UserButton } from '@clerk/nextjs';
import { FunnelBars, GlassCard, StatCard, TrendChart } from '@/components/admin/analytics/DashboardWidgets';
import { db, dbYok } from '@/db';
import { analyticsEvents, catalogProducts, orders } from '@/db/schema';
import { getAdminAuth } from '@/lib/admin-auth';
import { averagePerDay, dailySeries, periodDelta, sourceRows } from '@/lib/analytics-dashboard';
import { buildFunnel, cleanEvents, isTestOrder, KNOWN_TEST_ORDER_NOS } from '@/lib/analytics-funnel';
import { and, desc, eq, gte } from 'drizzle-orm';
import { Check, Eye, ShoppingBag, Users } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const DAY = 86_400_000;
const CHART_DAYS = 30;

const money = (value: number) => value.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') redirect('/admin/giris');
  const params = await searchParams;
  const days = params.days === '7' ? 7 : params.days === '90' ? 90 : 30;
  const now = Date.now();
  const since = new Date(now - days * DAY);
  const previousSince = new Date(now - days * 2 * DAY);
  const chartSince = new Date(now - CHART_DAYS * DAY);
  const eventsSince = new Date(Math.min(previousSince.getTime(), chartSince.getTime()));

  const [allEvents, paidOrders, catalogRows] = dbYok
    ? [[], [], []]
    : await Promise.all([
        db.select().from(analyticsEvents).where(gte(analyticsEvents.occurredAt, eventsSince)).orderBy(desc(analyticsEvents.occurredAt)),
        db.select().from(orders).where(and(eq(orders.status, 'paid'), gte(orders.paidAt, since))).orderBy(desc(orders.paidAt)),
        db.select().from(catalogProducts),
      ]);

  const cleanedAll = cleanEvents(allEvents);
  const cleaned = cleanedAll.filter((event) => event.occurredAt >= since);
  const previous = cleanedAll.filter((event) => event.occurredAt >= previousSince && event.occurredAt < since);
  const chartPoints = dailySeries(cleanedAll.filter((event) => event.occurredAt >= chartSince), CHART_DAYS, new Date(now));

  const funnelCounts = buildFunnel(cleaned);
  const previousCounts = buildFunnel(previous);
  const rawSessions = new Set(allEvents.filter((event) => event.occurredAt >= since).map((event) => event.sessionId)).size;
  const excludedSessions = rawSessions - funnelCounts.sessions;

  const realOrders = paidOrders.filter(
    (order) => !isTestOrder(
      { orderNo: order.orderNo, total: Number(order.total), productIds: order.items.map((item) => item.productId ?? '') },
      KNOWN_TEST_ORDER_NOS
    )
  );
  const excludedOrders = paidOrders.length - realOrders.length;
  const revenue = realOrders.reduce((sum, order) => sum + Number(order.total), 0);
  const averageCart = realOrders.length ? revenue / realOrders.length : 0;

  const sources = sourceRows(cleaned).slice(0, 6);
  const avgPerDay = averagePerDay(dailySeries(cleaned, Math.min(days, CHART_DAYS), new Date(now)));

  const productNames = new Map([
    ...LEGACY_PRODUCT_NAMES.map((product) => [product.id, product.name] as const),
    ...catalogRows.map((row) => [row.id, row.data.name] as const),
  ]);
  const productMap = new Map<string, { views: Set<string>; carts: Set<string> }>();
  for (const event of cleaned) {
    if (!event.productId) continue;
    const current = productMap.get(event.productId) ?? { views: new Set<string>(), carts: new Set<string>() };
    if (event.eventName === 'view_item') current.views.add(event.sessionId);
    if (event.eventName === 'add_to_cart') current.carts.add(event.sessionId);
    productMap.set(event.productId, current);
  }
  const products = [...productMap.entries()]
    .map(([id, data]) => ({ id, name: productNames.get(id) ?? id, views: data.views.size, carts: data.carts.size }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 6);

  const funnel = [
    { label: 'Gerçek ziyaretçi', value: funnelCounts.sessions },
    { label: 'Ürün inceleyen', value: funnelCounts.viewItem },
    { label: 'Sepete ekleyen', value: funnelCounts.addToCart },
    { label: 'Ödemeye geçen', value: funnelCounts.beginCheckout },
    { label: 'Ödemeyi tamamlayan', value: realOrders.length },
  ];

  const submitSessions = new Set(cleaned.filter((e) => e.eventName === 'checkout_submit').map((e) => e.sessionId)).size;
  const errorCounts = new Map<string, number>();
  for (const event of cleaned) {
    if (event.eventName !== 'checkout_error') continue;
    const meta = event.metadata ?? {};
    const label = meta.stage === 'validation' ? `Form eksik/hatalı: ${meta.fields}` : `Sunucu ${meta.status}: ${meta.reason}`;
    errorCounts.set(label, (errorCounts.get(label) ?? 0) + 1);
  }
  const checkoutErrors = [...errorCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);

  const lowTraffic = funnelCounts.sessions > 0 && avgPerDay < 10;
  const checkoutLeak = funnelCounts.beginCheckout > 0 && realOrders.length === 0;
  const toRate = (part: number, whole: number) => (whole ? `%${((part / whole) * 100).toLocaleString('tr-TR', { maximumFractionDigits: 1 })}` : '—');

  return (
    <AdminFrame userSlot={<UserButton />}>
    <main className="relative min-h-screen px-4 py-8 text-[#171713] sm:px-8 sm:py-10">

      <div className="relative mx-auto max-w-7xl">
        <header className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <Link href="/admin" className="text-sm text-neutral-600">← Dashboard</Link>
            <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9e8e63]">Birinci taraf ölçüm · temizlenmiş veri</p>
            <h1 className="mt-2 font-heading text-4xl leading-none sm:text-5xl">Analitik Merkezi</h1>
            <p className="mt-3 text-[13px] text-[#7b7466]">Yalnızca çerez izni veren gerçek ziyaretçiler. Admin oturumları ve test siparişleri hariç.</p>
          </div>
          <nav aria-label="Dönem" className="flex gap-1.5 rounded-full border border-white/80 bg-white/60 p-1 backdrop-blur-xl">
            {[7, 30, 90].map((value) => (
              <Link key={value} href={`/admin/analitik?days=${value}`} className={`rounded-full px-4 py-2 text-[13px] ${value === days ? 'bg-[#171713] text-white' : 'text-[#7b7466]'}`}>{value} gün</Link>
            ))}
          </nav>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Gerçek ziyaretçi" value={funnelCounts.sessions} icon={<Users className="h-5 w-5" />} delta={periodDelta(funnelCounts.sessions, previousCounts.sessions)} delay={0.05} />
          <StatCard label="Ürün inceleyen" value={funnelCounts.viewItem} icon={<Eye className="h-5 w-5" />} delta={periodDelta(funnelCounts.viewItem, previousCounts.viewItem)} delay={0.1} />
          <StatCard label="Sepete ekleyen" value={funnelCounts.addToCart} icon={<ShoppingBag className="h-5 w-5" />} delta={periodDelta(funnelCounts.addToCart, previousCounts.addToCart)} delay={0.15} />
          <StatCard label="Gerçek sipariş" value={realOrders.length} dark icon={<Check className="h-5 w-5" />} note={funnelCounts.beginCheckout ? `${funnelCounts.beginCheckout} kişi ödemeye geçti` : 'henüz ödemeye geçen yok'} delay={0.2} />
        </section>

        {(lowTraffic || checkoutLeak) && (
          <section className="mt-4">
            <article className="flex items-start gap-3.5 rounded-[22px] border border-[#b5533a]/35 bg-gradient-to-r from-[#fff0e9]/90 to-white/60 p-5 backdrop-blur-xl">
              <div className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-[#b5533a] font-bold text-white">!</div>
              <div>
                <h2 className="text-[15px] font-semibold">
                  {lowTraffic && checkoutLeak ? 'İki darboğaz var: trafik ve ödeme adımı' : lowTraffic ? 'Darboğaz: trafik düşük' : 'Darboğaz: ödeme adımı'}
                </h2>
                <p className="mt-1 text-[13px] leading-relaxed text-[#5b524a]">
                  {lowTraffic && <>Günlük gerçek ziyaretçi ortalama <b>~{avgPerDay.toLocaleString('tr-TR', { maximumFractionDigits: 1 })}</b>. </>}
                  {checkoutLeak && <>Ödemeye geçen <b>{funnelCounts.beginCheckout}</b> oturumun hiçbiri siparişi tamamlamadı. </>}
                  {lowTraffic && 'Trafik için düzenli içerik/reklam, '}
                  {checkoutLeak && 'ödeme adımı için aşağıdaki "Ödeme engelleri" ölçümü izlenmeli.'}
                </p>
              </div>
            </article>
          </section>
        )}

        <section className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
          <GlassCard delay={0.3}>
            <h2 className="font-heading text-[26px]">Günlük trafik</h2>
            <p className="mt-1 text-xs text-[#7b7466]">Son {CHART_DAYS} gün · benzersiz oturum</p>
            <div className="mt-2.5 flex gap-4 text-xs text-[#7b7466]">
              <span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-full bg-[#c5a46d]" />Ziyaretçi</span>
              <span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-full bg-[#171713]" />Ödemeye geçen</span>
            </div>
            <TrendChart points={chartPoints} />
          </GlassCard>

          <GlassCard delay={0.35} className="!border-[#2a2a22] !bg-gradient-to-br !from-[#1d1d17] !to-[#0f0f0c] text-white">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#cdbc91]">Doğrulanmış satış</p>
            <p className="mt-3.5 text-5xl font-semibold tracking-tight text-white">{money(revenue)}</p>
            <p className="mt-2 text-[13px] leading-relaxed text-white/55">
              {realOrders.length ? `${days} günlük ödenmiş gerçek sipariş cirosu.` : 'Gerçek ödenmiş sipariş yok.'}
              {excludedOrders > 0 && ` ${excludedOrders} test siparişi hesaba katılmadı.`}
            </p>
            <span className="mt-4 inline-block rounded-full bg-[#c5a46d]/15 px-3 py-1.5 text-xs text-[#e5d3a8]">
              {realOrders.length ? `Ortalama sepet: ${money(averageCart)}` : 'Ortalama sepet: henüz veri yok'}
            </span>
          </GlassCard>
        </section>

        <section className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
          <GlassCard delay={0.4}>
            <h2 className="font-heading text-[26px]">Dönüşüm hunisi</h2>
            <p className="mt-1 text-xs text-[#7b7466]">Benzersiz oturum · bir adıma ulaşan, önceki adımlara da sayılır</p>
            <FunnelBars steps={funnel} />
            <p className="mt-4 text-xs text-[#7b7466]">Ziyaretçi → inceleme {toRate(funnelCounts.viewItem, funnelCounts.sessions)} · inceleme → sepet {toRate(funnelCounts.addToCart, funnelCounts.viewItem)} · sepet → ödeme {toRate(funnelCounts.beginCheckout, funnelCounts.addToCart)}</p>
          </GlassCard>

          <GlassCard delay={0.45}>
            <h2 className="font-heading text-[26px]">Trafik kaynakları</h2>
            <p className="mt-1 text-xs text-[#7b7466]">Instagram ve Facebook yönlendirmeleri birleştirildi</p>
            <div className="mt-3.5 grid gap-2">
              {sources.map((row) => (
                <div key={row.label} className={`flex items-center justify-between rounded-[13px] p-3 text-[13.5px] ${row.label === 'Instagram' ? 'bg-gradient-to-r from-[#e7d3a4]/55 to-white/50 font-semibold' : 'bg-white/55'}`}>
                  <span>{row.label}</span><span className="text-xs font-normal text-[#7b7466]">{row.sessions} oturum</span>
                </div>
              ))}
              {!sources.length && <p className="text-sm text-[#7b7466]">Çerez izni verilen ilk ziyaretten sonra kaynaklar görünecek.</p>}
            </div>
          </GlassCard>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-3">
          <GlassCard delay={0.5}>
            <h2 className="font-heading text-[26px]">Ürün ilgisi</h2>
            <p className="mt-1 text-xs text-[#7b7466]">İnceleyen · sepete ekleyen oturum</p>
            <div className="mt-3.5 grid gap-2">
              {products.map((row) => <div key={row.id} className="flex items-center justify-between gap-3 rounded-[13px] bg-white/55 p-3 text-[13.5px]"><span className="truncate">{row.name}</span><span className="whitespace-nowrap text-xs text-[#7b7466]">{row.views} · {row.carts}</span></div>)}
              {!products.length && <p className="text-sm text-[#7b7466]">Ürün olayları geldikçe performans burada görünecek.</p>}
            </div>
          </GlassCard>

          <GlassCard delay={0.55}>
            <h2 className="font-heading text-[26px]">Ödeme engelleri</h2>
            <p className="mt-1 text-xs text-[#7b7466]">Ödeme sayfasında ne oluyor</p>
            <div className="mt-3.5 grid gap-2">
              <div className="flex justify-between rounded-[13px] bg-white/55 p-3 text-[13.5px]"><span>Ödemeye geçen oturum</span><span className="text-xs text-[#7b7466]">{funnelCounts.beginCheckout}</span></div>
              <div className="flex justify-between rounded-[13px] bg-white/55 p-3 text-[13.5px]"><span>Formu gönderen oturum</span><span className="text-xs text-[#7b7466]">{submitSessions}</span></div>
              {checkoutErrors.map(([label, count]) => <div key={label} className="flex justify-between gap-3 rounded-[13px] bg-[#f6e0da]/70 p-3 text-[13.5px]"><span>{label}</span><b>{count}</b></div>)}
              {!checkoutErrors.length && <p className="text-xs text-[#7b7466]">Henüz ödeme hatası kaydı yok.</p>}
            </div>
          </GlassCard>

          <GlassCard delay={0.6}>
            <h2 className="font-heading text-[26px]">Veri güvenilirliği</h2>
            <p className="mt-1 text-xs text-[#7b7466]">Neler hesaba katılmadı, neyin bağlı olduğu</p>
            <div className="mt-3.5 grid gap-2 text-[13.5px]">
              <div className="flex justify-between rounded-[13px] bg-white/55 p-3"><span>Dahili oturum (admin / test)</span><span className="text-xs text-[#7b7466]">{excludedSessions}</span></div>
              <div className="flex justify-between rounded-[13px] bg-white/55 p-3"><span>Hariç tutulan test siparişi</span><span className="text-xs text-[#7b7466]">{excludedOrders}</span></div>
            </div>
            <div className="mt-3.5 flex flex-wrap gap-2 text-[12.5px]">
              {[['Site olayları', true], ['Siparişler', !dbYok], ['GA4', false], ['Metricool', false], ['Meta Pixel', false]].map(([name, ok]) => (
                <span key={String(name)} className="flex items-center gap-2 rounded-full border border-[#9e8e63]/25 bg-white/55 px-3 py-1.5"><i className={`h-2 w-2 rounded-full ${ok ? 'bg-[#4f9a5c]' : 'bg-[#c9bfae]'}`} />{name}</span>
              ))}
            </div>
            <p className="mt-3 text-[11.5px] leading-relaxed text-[#7b7466]">Gri olanlar panele bağlı değil. Çerez izni vermeyen ziyaretçiler görünmez; gerçek trafik bundan yüksektir.</p>
          </GlassCard>
        </section>
      </div>
    </main>
    </AdminFrame>
  );
}
