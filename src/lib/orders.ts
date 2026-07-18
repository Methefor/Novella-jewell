import { db, dbYok } from '@/db';
import { orders, type OrderItemRow } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import type { Order } from './checkout/types';

/**
 * Sipariş kalıcı kaydı — Neon Postgres (Drizzle).
 *
 * dbYok (DATABASE_URL tanımsız): fonksiyonlar sessizce null/false döner ve
 * loglar. Amaç: veritabanı henüz bağlanmamış bir ortamda ödeme akışının
 * çökmemesi. Production'da DATABASE_URL Vercel Storage tarafından sağlanır.
 */

/**
 * Ödeme başlamadan ÖNCE pending sipariş yaratır.
 * order_no DB tarafında otomatik üretilir (NJ-2026-0001) ve döndürülür —
 * bu değer Shopier'e platform_order_id olarak gider.
 */
export async function createPendingOrder(
  order: Order,
  randomNr: string
): Promise<{ orderNo: string; id: string } | null> {
  if (dbYok) {
    console.warn('[orders] DATABASE_URL yok — pending sipariş kaydedilmedi', {
      total: order.total,
    });
    return null;
  }

  const items: OrderItemRow[] = order.items.map((i) => ({
    slug: i.slug,
    ad: i.name,
    adet: i.quantity,
    birimFiyat: i.price,
  }));

  const [row] = await db
    .insert(orders)
    .values({
      status: 'pending',
      items,
      total: order.total.toFixed(2),
      customer: {
        adSoyad: `${order.customer.name} ${order.customer.surname}`.trim(),
        email: order.customer.email,
        telefon: order.customer.phone,
        adres: order.customer.address,
        il: order.customer.city,
        ilce: order.customer.district,
        not: order.customer.note,
      },
      randomNr,
      // orderNo, id, createdAt → DB default
    })
    .returning({ orderNo: orders.orderNo, id: orders.id });

  return row ?? null;
}

/**
 * Callback'te ödeme onaylanınca çağrılır. IDEMPOTENT: kayıt zaten 'paid' ise
 * hiçbir şey yapmaz ve `zatenPaid: true` döner (aynı callback iki kez gelirse
 * çift e-posta/işlem olmasın). Dönen değer, e-posta için sipariş satırını da
 * içerir (yalnızca bu çağrı paid'e ilk kez çektiyse).
 */
export async function markOrderPaid(
  orderNo: string,
  shopierPaymentId?: string
): Promise<
  | { ok: true; zatenPaid: boolean; order: typeof orders.$inferSelect | null }
  | { ok: false }
> {
  if (dbYok) {
    console.warn('[orders] DATABASE_URL yok — paid işaretlenemedi', { orderNo });
    return { ok: false };
  }

  // Yalnızca status='pending' iken paid'e çek (atomik idempotency).
  // Zaten paid ise UPDATE 0 satır etkiler; ikinci callback no-op olur.
  const [updated] = await db
    .update(orders)
    .set({
      status: 'paid',
      shopierPaymentId: shopierPaymentId ?? null,
      paidAt: new Date(),
    })
    .where(and(eq(orders.orderNo, orderNo), eq(orders.status, 'pending')))
    .returning();

  if (updated) {
    // Bu çağrı pending → paid geçişini yaptı (ilk kez).
    return { ok: true, zatenPaid: false, order: updated };
  }

  // 0 satır: ya kayıt yok ya zaten paid/failed. Durumu kontrol et.
  const [mevcut] = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNo, orderNo))
    .limit(1);

  if (mevcut && mevcut.status === 'paid') {
    return { ok: true, zatenPaid: true, order: null }; // tekrar gelen callback
  }
  return { ok: false }; // kayıt yok
}

/** Ödeme reddedilince. pending değilse dokunmaz (idempotent). */
export async function markOrderFailed(orderNo: string): Promise<boolean> {
  if (dbYok) {
    console.warn('[orders] DATABASE_URL yok — failed işaretlenemedi', { orderNo });
    return false;
  }
  const res = await db
    .update(orders)
    .set({ status: 'failed' })
    .where(and(eq(orders.orderNo, orderNo), eq(orders.status, 'pending')))
    .returning({ id: orders.id });
  return res.length > 0;
}
