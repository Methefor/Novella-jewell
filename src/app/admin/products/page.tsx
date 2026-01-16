import Link from 'next/link';
import { Package, Plus, Search } from 'lucide-react';
import { getAllProducts } from '@/lib/products';

export default async function AdminProductsPage() {
  // TODO: Fetch products from Sanity
  const products = await getAllProducts();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-cormorant text-4xl font-bold text-white md:text-5xl">
            Ürün Yönetimi
          </h1>
          <p className="mt-2 font-inter text-white/60">
            {products.length} ürün bulundu
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3 font-inter font-semibold text-black transition-all hover:shadow-lg hover:shadow-gold/30"
        >
          <Plus className="h-5 w-5" />
          Yeni Ürün
        </Link>
      </div>

      {/* Search Bar */}
      <div className="glass mb-6 rounded-lg p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Ürün ara..."
            className="w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-12 pr-4 font-inter text-white placeholder:text-white/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="glass overflow-hidden rounded-2xl">
        {products.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="mx-auto h-16 w-16 text-white/20 mb-4" />
            <h3 className="mb-2 font-cormorant text-xl font-semibold text-white">
              Henüz Ürün Yok
            </h3>
            <p className="mb-6 font-inter text-white/60">
              İlk ürününüzü ekleyerek başlayın
            </p>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3 font-inter font-semibold text-black"
            >
              <Plus className="h-5 w-5" />
              Yeni Ürün Ekle
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left font-inter text-sm font-semibold text-white/80">
                    Ürün
                  </th>
                  <th className="px-6 py-4 text-left font-inter text-sm font-semibold text-white/80">
                    Kategori
                  </th>
                  <th className="px-6 py-4 text-left font-inter text-sm font-semibold text-white/80">
                    Fiyat
                  </th>
                  <th className="px-6 py-4 text-left font-inter text-sm font-semibold text-white/80">
                    Stok
                  </th>
                  <th className="px-6 py-4 text-right font-inter text-sm font-semibold text-white/80">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-white/5 transition-colors hover:bg-white/5"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-white/5">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-white/20">
                              {product.category[0]}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-inter font-semibold text-white">
                            {product.name}
                          </div>
                          <div className="font-inter text-xs text-white/60">
                            {product.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 font-inter text-xs text-gold">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-inter font-semibold text-gold">
                      ₺{product.price.toLocaleString('tr-TR')}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-inter text-sm ${
                          (product.stock || 0) > 0
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}
                      >
                        {product.stock || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="rounded-lg bg-white/5 px-3 py-2 font-inter text-xs font-medium text-white/70 transition-all hover:bg-white/10 hover:text-white"
                        >
                          Düzenle
                        </Link>
                        <button
                          className="rounded-lg bg-red-500/20 px-3 py-2 font-inter text-xs font-medium text-red-400 transition-all hover:bg-red-500/30"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

