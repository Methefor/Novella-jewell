import type { Order } from './checkout/types';

// Sipariş kayıt noktası — Supabase fazında DB'ye taşınır.
// Şimdilik: log + opsiyonel webhook bildirimi.
export async function saveOrder(order: Order, status: 'pending' | 'paid'): Promise<void> {
  console.log(`[Order] ${status.toUpperCase()} — ${order.id}`, {
    total: order.total,
    items: order.items.length,
    customer: order.customer.email,
  });

  // Opsiyonel: webhook bildirimi (Supabase/n8n/Make entegrasyonuna kadar devre dışı)
  // const webhookUrl = process.env.ORDER_WEBHOOK_URL;
  // if (webhookUrl) {
  //   await fetch(webhookUrl, { method: 'POST', body: JSON.stringify({ order, status }) });
  // }
}
