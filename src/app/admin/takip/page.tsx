import { db, dbYok } from '@/db';
import { emailOutbox, orders } from '@/db/schema';
import { getAdminAuth } from '@/lib/admin-auth';
import { and, desc, eq, inArray, or } from 'drizzle-orm';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { checkOrderWithPayTR, checkPendingOperations } from './actions';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;
const emailLabels: Record<string, string> = { pending: 'Gönderim bekliyor', sending: 'Gönderiliyor', sent: 'Resend kabul etti', retry: 'Yeniden denenecek', review: 'İnceleme gerekiyor' };
const date = (value: Date | null) => value?.toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' }) ?? '—';

export default async function FollowupPage({ searchParams }: { searchParams: Promise<{ checked?: string; q?: string }> }) {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') redirect('/admin/giris');
  const params = await searchParams;
  const checked = params.checked === '1';
  const [inspected] = !dbYok && params.q && /^NJ-\d{4}-\d+$/.test(params.q) ? await db.select({ orderNo: orders.orderNo, note: orders.providerCheckNote }).from(orders).where(eq(orders.orderNo, params.q)).limit(1) : [];
  const [pending, emails] = dbYok ? [[], []] : await Promise.all([
    db.select({ orderNo: orders.orderNo, status: orders.status, refundStatus: orders.refundStatus, checkedAt: orders.providerCheckedAt, note: orders.providerCheckNote, createdAt: orders.createdAt }).from(orders)
      .where(or(eq(orders.status, 'pending'), inArray(orders.refundStatus, ['processing', 'submitted', 'review']))).orderBy(desc(orders.createdAt)).limit(100),
    db.select({ id: emailOutbox.id, orderNo: orders.orderNo, kind: emailOutbox.kind, status: emailOutbox.status, attempts: emailOutbox.attempts, lastError: emailOutbox.lastError, providerId: emailOutbox.providerId, createdAt: emailOutbox.createdAt, nextAttemptAt: emailOutbox.nextAttemptAt }).from(emailOutbox)
      .innerJoin(orders, eq(orders.id, emailOutbox.orderId)).orderBy(desc(emailOutbox.createdAt)).limit(100),
  ]);
  const [attention] = dbYok ? [] : await db.select({ id: emailOutbox.id }).from(emailOutbox).where(and(inArray(emailOutbox.status, ['retry', 'review']))).limit(1);
  return <main className="min-h-screen bg-[#f6f2eb] px-5 py-10"><div className="mx-auto max-w-6xl space-y-8">
    <header><Link href="/admin/siparisler" className="text-sm underline">← Sipariş Merkezi</Link><h1 className="mt-6 font-serif text-3xl">Ödeme ve bildirim takibi</h1><p className="mt-3 text-sm text-neutral-600">Bekleyen ödeme sonuçları, banka iade onayları ve e-posta gönderimleri.</p></header>
    {dbYok && <p role="alert">Veritabanı bağlantısı yok.</p>}
    {checked && <p role="status" className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm">Kontrol tamamlandı. Güncel sonuçlar aşağıda gösteriliyor.</p>}
    {attention && <p role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-4">Kontrol gerektiren e-posta gönderimleri var. Aşağıdaki kayıtları inceleyin.</p>}
    <form action={checkPendingOperations}><button className="rounded-xl bg-black px-5 py-3 text-sm text-white">Bekleyen işlemleri kontrol et</button><p className="mt-3 text-xs text-neutral-600">Yeni ödeme veya iade başlatmaz. Sağlayıcıdan durum sorgular ve zamanı gelen e-postaları güvenli biçimde yeniden dener. Bir çalıştırmada en fazla 8 sipariş ve 8 e-posta işlenir.</p></form>
    <form action={checkOrderWithPayTR} className="rounded-xl bg-white p-5"><label htmlFor="paytr-order" className="block text-sm mb-3">Belirli bir siparişin PayTR kaydını sorgula</label><div className="flex flex-wrap gap-3"><input id="paytr-order" name="orderNo" required pattern="NJ-[0-9]{4}-[0-9]+" placeholder="NJ-2026-0009" className="rounded-lg border-neutral-300 text-sm" /><button className="rounded-lg border px-4 py-2 text-sm">PayTR sonucunu sorgula</button></div>{params.q && <p role="status" className="mt-3 text-sm">{inspected ? `${inspected.orderNo}: ${inspected.note ?? 'Henüz sonuç yok.'}` : 'Sipariş bulunamadı.'}</p>}</form>
    <section className="rounded-2xl bg-white p-5"><h2 className="mb-4 text-xl">Sonuç bekleyen siparişler ({pending.length})</h2>
      {!pending.length && <p className="text-sm text-neutral-500">Bekleyen ödeme veya iade yok.</p>}
      <ul className="divide-y">{pending.map((order) => <li key={order.orderNo} className="py-4 text-sm space-y-2"><Link className="underline" href={`/admin/siparisler?q=${encodeURIComponent(order.orderNo)}`}>{order.orderNo}</Link><p>{order.status === 'pending' ? 'Ödeme sonucu bekleniyor' : order.refundStatus === 'submitted' ? 'İade kabul edildi; banka sonucu bekleniyor' : 'İade incelemesi gerekiyor'}</p><p>{order.note ?? 'Henüz sorgulanmadı.'}</p><p className="text-xs text-neutral-500">Oluşturuldu: {date(order.createdAt)} · Son sorgu: {date(order.checkedAt)}</p></li>)}</ul>
    </section>
    <section className="rounded-2xl bg-white p-5"><h2 className="mb-4 text-xl">E-posta gönderimleri</h2><p className="text-xs text-neutral-500 mb-4">Bu sürümden sonraki kayıtlar gösterilir. “Resend kabul etti” teslim alındı anlamına gelmez; teslim, geri dönme ve spam sonuçlarını Resend bağlantısından kontrol edin. Süresi dolmuş belirsiz gönderimler otomatik tekrar gönderilmez.</p>
      {!emails.length && <p className="text-sm text-neutral-500">Henüz yeni e-posta kaydı yok.</p>}
      <ul className="divide-y">{emails.map((email) => <li key={email.id} className="py-4 text-sm space-y-2"><p>{email.orderNo} · {email.kind === 'order_confirmation' ? 'Sipariş onayı' : email.kind === 'refund_completed' ? 'Banka iade onayı' : email.kind === 'refund_submitted' ? 'İade talebi' : 'Sipariş durumu'}</p><p>{emailLabels[email.status] ?? email.status} · Deneme: {email.attempts}</p>{email.lastError && <p className="text-amber-800">{email.lastError}</p>}{email.status === 'retry' && <p className="text-xs">Sonraki deneme için en erken: {date(email.nextAttemptAt)}</p>}{email.providerId && <a className="underline" href={`https://resend.com/emails/${encodeURIComponent(email.providerId)}`} target="_blank" rel="noopener noreferrer">Resend teslim kaydı</a>}</li>)}</ul>
    </section>
  </div></main>;
}
