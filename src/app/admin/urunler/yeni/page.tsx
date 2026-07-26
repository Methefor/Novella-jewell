import { getAdminAuth } from '@/lib/admin-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ProductForm from '../ProductForm';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') redirect('/admin/giris');

  return (
    <main className="min-h-screen bg-[#f6f2eb] px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/admin/urunler" className="text-sm text-neutral-600">← Ürünlere dön</Link>
        <h1 className="mb-8 mt-3 font-heading text-4xl">Yeni Ürün</h1>
        <ProductForm />
      </div>
    </main>
  );
}
