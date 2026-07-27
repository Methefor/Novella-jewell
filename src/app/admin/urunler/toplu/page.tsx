import { getAdminAuth } from '@/lib/admin-auth';
import { DEFAULT_PRODUCT_TEMPLATE, NOVELLA_CARE_NOTE } from '@/lib/product-template';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import BulkProductForm from './BulkProductForm';

export const dynamic = 'force-dynamic';

export default async function BulkProductsPage() {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') redirect('/admin/giris');

  return (
    <main className="min-h-screen bg-[#f6f2eb] px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin/urunler" className="text-sm text-neutral-600">
          ← Ürünlere dön
        </Link>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#9e8e63]">
              Katalog operasyonu
            </p>
            <h1 className="mt-2 font-heading text-4xl">Toplu Ürün Ekleme Merkezi</h1>
            <p className="mt-2 max-w-3xl text-sm text-neutral-600">
              Bir seferde 50 ürüne kadar taslak oluşturun. Ortak kategori, koleksiyon,
              malzeme ve özellik şablonu tüm satırlara güvenli biçimde uygulanır.
            </p>
          </div>
        </div>
        <BulkProductForm
          initialTemplate={DEFAULT_PRODUCT_TEMPLATE}
          careNote={NOVELLA_CARE_NOTE}
        />
      </div>
    </main>
  );
}

