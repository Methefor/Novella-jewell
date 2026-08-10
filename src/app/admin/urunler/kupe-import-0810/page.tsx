import manifest from '../../../../../docs/imports/earrings-2026-08-10.json';
import { getAdminAuth } from '@/lib/admin-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import PreparedEarringImport, { type PreparedEarring } from '../kupe-import/PreparedEarringImport';

export const dynamic = 'force-dynamic';

export default async function PreparedEarringImport0810Page() {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') redirect('/admin/giris');

  return (
    <main className="min-h-screen bg-[#f6f2eb] px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/admin/urunler" className="text-sm text-neutral-600">← Ürünlere dön</Link>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#947d4e]">10 Ağustos · kontrollü katalog aktarımı</p>
        <h1 className="mt-2 font-heading text-4xl">17 Küpe · Görsel ve Taslak Aktarımı</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600">18 ZIP incelendi. Mükerrer ve renk tutarsızlığı bulunan set-12 aktarım dışı bırakıldı. Onaylanan ürünlerin isim, bağlantı, açıklama, koleksiyon, renk ve 316L özellikleri hazırdır; fiyat ve stok girilene kadar yayın dışı kalır.</p>
        <PreparedEarringImport manifest={manifest as PreparedEarring[]} />
      </div>
    </main>
  );
}
