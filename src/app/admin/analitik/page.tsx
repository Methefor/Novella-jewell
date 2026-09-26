// LEGACY (yalnızca analitik etiket çözümleme, salt okunur): src/data/products.ts katalog kaynağı DEĞİLDİR (ADR-013).
// Eski analitik olaylarındaki ürün kimliklerini okunabilir isme çevirmek için kullanılır;
// vitrini, siparişi, stoğu veya fiyatı etkilemez ve hiçbir şey yazmaz.
import { PRODUCTS as LEGACY_PRODUCT_NAMES } from '@/data/products';
import { db, dbYok } from '@/db';
import { analyticsEvents, catalogProducts, orders } from '@/db/schema';
import { getAdminAuth } from '@/lib/admin-auth';
import { buildFunnel, cleanEvents, isTestOrder } from '@/lib/analytics-funnel';
import { and, desc, eq, gte } from 'drizzle-orm';
import { Activity, BarChart3, ShoppingBag, Users } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const DAY = 86_400_000;
// Ürün id'siyle yakalanamayan, elle doğrulanmış test siparişleri.
const EXCLUDED_ORDER_NOS: readonly string[] = ['NJ-2026-0001'];

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') redirect('/admin/giris');
  const params = await searchParams;
  const days = params.days === '7' ? 7 : params.days === '90' ? 90 : 30;
  const since = new Date(Date.now() - days * DAY);
  const [events, paidOrders, catalogRows] = dbYok
    ? [[], [], []]
    : await Promise.all([
        db.select().from(analyticsEvents).where(gte(analyticsEvents.occurredAt, since)).orderBy(desc(analyticsEvents.occurredAt)),
        db.select().from(orders).where(and(eq(orders.status, 'paid'), gte(orders.paidAt, since))).orderBy(desc(orders.paidAt)),
        db.select().from(catalogProducts),
      ]);
  const rawSessions = new Set(events.map((event) => event.sessionId)).size;
  const cleaned = cleanEvents(events);
  const funnelCounts = buildFunnel(cleaned);
  const sessions = funnelCounts.sessions;
  const excludedSessions = rawSessions - sessions;
  const realOrders = paidOrders.filter(
    (order) => !isTestOrder(
      { orderNo: order.orderNo, total: Number(order.total), productIds: order.items.map((item) => item.productId ?? '') },
      EXCLUDED_ORDER_NOS
    )
  );
  const excludedOrders = paidOrders.length - realOrders.length;
  const revenue = realOrders.reduce((sum, order) => sum + Number(order.total), 0);
  const conversion = sessions ? (realOrders.length / sessions) * 100 : 0;
  const sourceMap = new Map<string, { sessions: Set<string>; events: number }>();
  for (const event of cleaned) {
    const current = sourceMap.get(event.source) ?? { sessions: new Set<string>(), events: 0 };
    current.sessions.add(event.sessionId);
    current.events += 1;
    sourceMap.set(event.source, current);
  }
  const sources = [...sourceMap.entries()]
    .map(([source, data]) => ({ source, sessions: data.sessions.size, events: data.events }))
    .sort((a, b) => b.sessions - a.sessions);
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
    .slice(0, 12);
  const funnel = [
    { label: 'Oturum', value: sessions },
    { label: 'Ürün görüntüleyen oturum', value: funnelCounts.viewItem },
    { label: 'Sepete ekleyen oturum', value: funnelCounts.addToCart },
    { label: 'Ödemeye geçen oturum', value: funnelCounts.beginCheckout },
    { label: 'Satın alma (gerçek sipariş)', value: realOrders.length },
  ];
  const funnelMax = Math.max(funnel[0].value, 1);
  const submitSessions = new Set(cleaned.filter((e) => e.eventName === 'checkout_submit').map((e) => e.sessionId)).size;
  const errorCounts = new Map<string, number>();
  for (const event of cleaned) {
    if (event.eventName !== 'checkout_error') continue;
    const meta = event.metadata ?? {};
    const label = meta.stage === 'validation' ? `Form eksik/hatalı: ${meta.fields}` : `Sunucu ${meta.status}: ${meta.reason}`;
    errorCounts.set(label, (errorCounts.get(label) ?? 0) + 1);
  }
  const checkoutErrors = [...errorCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);

  return (
    <main className="min-h-screen bg-[#f6f2eb] px-4 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <Link href="/admin" className="text-sm text-neutral-600">← Dashboard</Link>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#9e8e63]">Birinci taraf ölçüm</p>
            <h1 className="mt-2 font-heading text-4xl sm:text-5xl">Gerçek Analitik Merkezi</h1>
            <p className="mt-3 text-sm text-neutral-600">Çerez izni verilen anonim oturumlar ve doğrulanmış siparişlerden hesaplanır.</p>
          </div>
          <form><select name="days" defaultValue={String(days)} onChange={undefined} className="rounded-xl border-[#d8cdbb] bg-white text-sm"><option value="7">Son 7 gün</option><option value="30">Son 30 gün</option><option value="90">Son 90 gün</option></select><button className="ml-2 rounded-xl bg-black px-4 py-2.5 text-sm text-white">Uygula</button></form>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Anonim oturum', value: sessions.toLocaleString('tr-TR'), icon: Users },
            { label: 'Ürün görüntüleyen oturum', value: funnelCounts.viewItem.toLocaleString('tr-TR'), icon: Activity },
            { label: 'Gerçek sipariş', value: realOrders.length.toLocaleString('tr-TR'), icon: ShoppingBag },
            { label: 'Dönüşüm', value: `%${conversion.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}`, icon: BarChart3 },
          ].map((card) => <article key={card.label} className="rounded-2xl border border-[#e3d9c8] bg-white p-5"><card.icon className="h-5 w-5 text-[#9e8e63]" /><p className="mt-5 text-xs text-neutral-500">{card.label}</p><p className="mt-1 text-3xl font-semibold">{card.value}</p></article>)}
        </section>

        <section className="mt-6 grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
          <article className="rounded-2xl border border-[#e3d9c8] bg-white p-6">
            <h2 className="font-heading text-3xl">Dönüşüm hunisi</h2>
            <div className="mt-6 space-y-4">{funnel.map((item, index) => <div key={item.label}><div className="flex justify-between text-sm"><span>{item.label}</span><span className="font-semibold">{item.value}</span></div><div className="mt-2 h-8 overflow-hidden rounded-lg bg-[#f0ebe2]"><div className="flex h-full min-w-10 items-center rounded-lg bg-gradient-to-r from-[#9e8e63] to-[#cdbc91] px-3 text-xs text-white" style={{ width: `${Math.max((item.value / funnelMax) * 100, item.value ? 8 : 0)}%` }}>{index ? `%${funnel[index - 1].value ? ((item.value / funnel[index - 1].value) * 100).toFixed(1) : '0'}` : ''}</div></div></div>)}</div>
          </article>
          <article className="rounded-2xl border border-[#e3d9c8] bg-[#171713] p-6 text-white">
            <p className="text-xs uppercase tracking-wider text-[#cdbc91]">Doğrulanmış satış</p>
            <p className="mt-4 text-4xl font-semibold">{revenue.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</p>
            <p className="mt-2 text-sm text-white/50">{days} günlük ödenmiş sipariş cirosu</p>
            <div className="mt-8 border-t border-white/10 pt-5"><p className="text-sm text-white/60">Ortalama sepet</p><p className="mt-1 text-2xl font-semibold">{(realOrders.length ? revenue / realOrders.length : 0).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</p></div>
            <p className="mt-6 text-xs text-white/40">Hariç tutulan: {excludedOrders} test siparişi, {excludedSessions} dahili oturum (admin/test ürün).</p>
          </article>
        </section>

        <section className="mt-6 rounded-2xl border border-[#e3d9c8] bg-white p-6">
          <h2 className="font-heading text-2xl">Ödeme engelleri</h2>
          <p className="mt-2 text-sm text-neutral-600">Ödemeye geçen {funnelCounts.beginCheckout} oturumdan {submitSessions} tanesi formu gönderdi. Ölçüm başladıktan sonraki hatalar aşağıda görünür.</p>
          <div className="mt-4 space-y-2">{checkoutErrors.map(([label, count]) => <div key={label} className="flex justify-between rounded-xl bg-[#f8f5ef] p-3 text-sm"><span>{label}</span><span className="font-semibold">{count}</span></div>)}{!checkoutErrors.length && <p className="text-sm text-neutral-500">Henüz ödeme hatası kaydı yok.</p>}</div>
        </section>

        <section className="mt-6 grid gap-5 xl:grid-cols-2">
          <article className="rounded-2xl border border-[#e3d9c8] bg-white p-6"><h2 className="font-heading text-2xl">Trafik kaynakları</h2><div className="mt-5 space-y-3">{sources.slice(0, 12).map((row) => <div key={row.source} className="flex items-center justify-between rounded-xl bg-[#f8f5ef] p-3"><span className="font-medium">{row.source}</span><span className="text-sm text-neutral-500">{row.sessions} oturum · {row.events} olay</span></div>)}{!sources.length && <p className="text-sm text-neutral-500">Çerez izni verilen ilk ziyaretten sonra kaynaklar görünecek.</p>}</div></article>
          <article className="rounded-2xl border border-[#e3d9c8] bg-white p-6"><h2 className="font-heading text-2xl">Ürün ilgisi</h2><div className="mt-5 space-y-3">{products.map((row) => <div key={row.id} className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-[#eee7dc] pb-3 text-sm"><span className="truncate font-medium">{row.name}</span><span className="text-neutral-500">{row.views} görüntüleme</span><span className="text-neutral-500">{row.carts} sepet</span></div>)}{!products.length && <p className="text-sm text-neutral-500">Ürün olayları geldikçe performans burada görünecek.</p>}</div></article>
        </section>
      </div>
    </main>
  );
}
