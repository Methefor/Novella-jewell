import { notFound } from 'next/navigation';
import { getOrder } from '@/lib/orders';
import OrderDetail from '@/components/OrderDetail';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-8 font-cormorant text-4xl font-bold text-white md:text-5xl">
        Sipariş Detayı
      </h1>
      <OrderDetail order={order} />
    </div>
  );
}

