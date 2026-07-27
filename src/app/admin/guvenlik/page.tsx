import { db, dbYok } from '@/db';
import { adminAuditLogs } from '@/db/schema';
import { ADMIN_EMAIL, getAdminAuth } from '@/lib/admin-auth';
import { desc } from 'drizzle-orm';
import { Activity, KeyRound, LockKeyhole, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const actionLabels: Record<string, string> = {
  'product.create': 'Ürün oluşturma',
  'product.update': 'Ürün güncelleme',
  'product.publish': 'Ürünü yayınlama',
  'product.unpublish': 'Ürünü yayından kaldırma',
  'stock.adjust': 'Stok düzeltme',
  'order.status_update': 'Sipariş durumu',
  'order.note_update': 'Sipariş notu',
  'order.refund': 'Sipariş iadesi',
  'campaign.create': 'Kampanya oluşturma',
  'campaign.product_add': 'Kampanyaya ürün ekleme',
  'campaign.item_update': 'Kampanya içeriği',
  'campaign.draft_generate': 'İçerik taslağı',
  'campaign.status_update': 'Kampanya durumu',
};

export default async function SecurityPage() {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') redirect('/admin/giris');
  const logs = dbYok
    ? []
    : await db
        .select()
        .from(adminAuditLogs)
        .orderBy(desc(adminAuditLogs.createdAt))
        .limit(250);

  return (
    <main className="min-h-screen bg-[#f6f2eb] px-4 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <header>
          <Link href="/admin" className="text-sm text-neutral-600">← Dashboard</Link>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#9e8e63]">Tek yönetici güvenliği</p>
          <h1 className="mt-2 font-heading text-4xl sm:text-5xl">Güvenlik ve İşlem Geçmişi</h1>
          <p className="mt-3 max-w-2xl text-sm text-neutral-600">Kritik yönetim işlemlerinin kim tarafından, ne zaman ve hangi kayıt üzerinde yapıldığını izleyin.</p>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <ShieldCheck className="h-6 w-6 text-emerald-700" />
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-emerald-700">Yetkili hesap</p>
            <p className="mt-2 break-all font-medium">{ADMIN_EMAIL}</p>
            <p className="mt-2 text-xs text-emerald-800">Yalnızca doğrulanmış bu e-posta yönetim alanına erişebilir.</p>
          </article>
          <article className="rounded-2xl border border-[#e3d9c8] bg-white p-5">
            <KeyRound className="h-6 w-6 text-[#8d7c55]" />
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-neutral-500">Kimlik sağlayıcı</p>
            <p className="mt-2 font-medium">Clerk doğrulaması</p>
            <p className="mt-2 text-xs text-neutral-500">Oturum ve e-posta doğrulaması sunucu tarafında kontrol edilir.</p>
          </article>
          <article className="rounded-2xl border border-[#e3d9c8] bg-white p-5">
            <LockKeyhole className="h-6 w-6 text-[#8d7c55]" />
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-neutral-500">Kritik işlem koruması</p>
            <p className="mt-2 font-medium">İade için sipariş no onayı</p>
            <p className="mt-2 text-xs text-neutral-500">İade ve stok işlemleri atomik kayıt ve işlem günlüğüyle korunur.</p>
          </article>
        </section>

        <section className="mt-8 rounded-2xl border border-[#e3d9c8] bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3"><Activity className="h-5 w-5 text-[#9e8e63]" /><h2 className="font-heading text-2xl">Merkezi işlem günlüğü</h2></div>
            <span className="text-xs text-neutral-500">Son {logs.length} kayıt</span>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="border-b border-[#e8dfd0] text-xs text-neutral-500"><tr><th className="pb-3">Tarih</th><th className="pb-3">İşlem</th><th className="pb-3">Kayıt</th><th className="pb-3">Açıklama</th><th className="pb-3">Yönetici</th></tr></thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-[#f0eadf] align-top">
                    <td className="py-3 text-xs text-neutral-500">{new Date(log.createdAt).toLocaleString('tr-TR')}</td>
                    <td className="py-3 font-medium">{actionLabels[log.action] ?? log.action}</td>
                    <td className="py-3"><span className="rounded-full bg-[#f2ede3] px-2 py-1 text-xs">{log.entityType}</span><p className="mt-1 max-w-48 truncate text-xs text-neutral-500">{log.entityId}</p></td>
                    <td className="py-3 text-neutral-700">{log.summary}</td>
                    <td className="py-3 text-xs text-neutral-500">{log.actorEmail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!logs.length && <p className="py-10 text-center text-sm text-neutral-500">Yeni yönetim işlemleri burada kaydedilecek.</p>}
          </div>
        </section>
      </div>
    </main>
  );
}
