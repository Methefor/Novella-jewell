import { ShoppingBag, Search } from 'lucide-react';
import Link from 'next/link';
import { getAllOrders } from '@/lib/orders';

export default async function AdminOrdersPage() {
  // TODO: Fetch orders from database
  const orders = await getAllOrders();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-cormorant text-4xl font-bold text-white md:text-5xl">
          Sipariş Yönetimi
        </h1>
        <p className="mt-2 font-inter text-white/60">
          {orders.length} sipariş bulundu
        </p>
      </div>

      {/* Search Bar */}
      <div className="glass mb-6 rounded-lg p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Sipariş ara..."
            className="w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-12 pr-4 font-inter text-white placeholder:text-white/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass overflow-hidden rounded-2xl">
        {orders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag className="mx-auto h-16 w-16 text-white/20 mb-4" />
            <h3 className="mb-2 font-cormorant text-xl font-semibold text-white">
              Henüz Sipariş Yok
            </h3>
            <p className="font-inter text-white/60">
              Siparişler burada görüntülenecek
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left font-inter text-sm font-semibold text-white/80">
                    Sipariş No
                  </th>
                  <th className="px-6 py-4 text-left font-inter text-sm font-semibold text-white/80">
                    Müşteri
                  </th>
                  <th className="px-6 py-4 text-left font-inter text-sm font-semibold text-white/80">
                    Tarih
                  </th>
                  <th className="px-6 py-4 text-left font-inter text-sm font-semibold text-white/80">
                    Durum
                  </th>
                  <th className="px-6 py-4 text-left font-inter text-sm font-semibold text-white/80">
                    Toplam
                  </th>
                  <th className="px-6 py-4 text-right font-inter text-sm font-semibold text-white/80">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.orderId}
                    className="border-b border-white/5 transition-colors hover:bg-white/5"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/orders/${order.orderId}`}
                        className="font-inter font-semibold text-gold hover:underline"
                      >
                        {order.orderId}
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-inter text-white">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 font-inter text-white/60">
                      {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 font-inter text-xs font-semibold ${
                          order.status === 'delivered'
                            ? 'bg-green-500/20 text-green-400'
                            : order.status === 'cancelled'
                            ? 'bg-red-500/20 text-red-400'
                            : order.status === 'shipped'
                            ? 'bg-purple-500/20 text-purple-400'
                            : order.status === 'processing'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {order.status === 'pending'
                          ? 'Beklemede'
                          : order.status === 'processing'
                          ? 'Hazırlanıyor'
                          : order.status === 'shipped'
                          ? 'Kargoda'
                          : order.status === 'delivered'
                          ? 'Teslim Edildi'
                          : 'İptal Edildi'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-inter font-semibold text-gold">
                      ₺{order.total.toLocaleString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/orders/${order.orderId}`}
                        className="rounded-lg bg-white/5 px-3 py-2 font-inter text-xs font-medium text-white/70 transition-all hover:bg-white/10 hover:text-white"
                      >
                        Detay
                      </Link>
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

