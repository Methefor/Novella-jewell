import { revalidateCatalog } from '@/lib/catalog-revalidation';
import { db, dbYok } from '@/db';
import {
  inventory,
  catalogProducts,
  orders,
  stockMovements,
  type OrderItemRow,
} from '@/db/schema';
import { PRODUCTS } from '@/data/products';
import { and, eq, sql } from 'drizzle-orm';
import type { Order } from './checkout/types';
import type { LegalAcceptance } from './legal-acceptance';
import { lockOrderPayments, reserveOrderStock, releasePaymentToCustomer } from './checkout/stock-reservation';
import { enqueueEmail } from './email-outbox';
import { buildOrderConfirmationEmail } from './email';

/**
 * Sipariş kalıcı kaydı — Neon Postgres (Drizzle).
 *
 * dbYok (DATABASE_URL tanımsız): fonksiyonlar sessizce null/false döner ve
 * loglar. Amaç: veritabanı henüz bağlanmamış bir ortamda ödeme akışının
 * çökmemesi. Production'da DATABASE_URL Vercel Storage tarafından sağlanır.
 */

/**
 * Ödeme başlamadan ÖNCE pending sipariş yaratır.
 * order_no DB tarafında otomatik üretilir (NJ-2026-0001) ve döndürülür;
 * PayTR merchant_oid değeri bu sipariş numarasından üretilir.
 */
export async function createPendingOrder(
  order: Order,
  randomNr: string,
  legalAcceptance: LegalAcceptance
): Promise<{ orderNo: string; id: string } | null> {
  if (dbYok) {
    console.warn('[orders] DATABASE_URL yok — pending sipariş kaydedilmedi', {
      total: order.total,
    });
    return null;
  }

  const items: OrderItemRow[] = order.items.map((i) => ({
    productId: i.productId,
    variantId: i.variantId,
    slug: i.slug,
    ad: i.name,
    adet: i.quantity,
    birimFiyat: i.price,
    image: i.image,
    customization: i.customization,
  }));

  const row = await db.transaction(async (tx) => {
    await lockOrderPayments(tx);
    for (const item of order.items) {
      const product = PRODUCTS.find((p) => p.id === item.productId);
      const variant = product?.variants.find((v) => v.id === item.variantId);

      if (variant) {
        await tx
          .insert(inventory)
          .values({
            productId: item.productId,
            variantId: item.variantId,
            stock: variant.stock,
          })
          .onConflictDoNothing();
      }

    }
    await reserveOrderStock(tx, order.items);

    const [created] = await tx.insert(orders).values({
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
      legalAcceptance,
      checkoutReserved: true,
      // orderNo, id, createdAt → DB default
    }).returning({ orderNo: orders.orderNo, id: orders.id });
    return created;
  });

  return row ?? null;
}

export async function markPaymentReady(orderNo: string): Promise<boolean> {
  if (dbYok) return false;
  return db.transaction((tx) => releasePaymentToCustomer(tx, orderNo));
}

/**
 * Callback'te ödeme onaylanınca çağrılır. IDEMPOTENT: kayıt zaten 'paid' ise
 * hiçbir şey yapmaz ve `zatenPaid: true` döner (aynı callback iki kez gelirse
 * çift e-posta/işlem olmasın). Dönen değer, e-posta için sipariş satırını da
 * içerir (yalnızca bu çağrı paid'e ilk kez çektiyse).
 */
export async function markOrderPaid(
  orderNo: string,
  paymentProviderId?: string,
  database = db,
  invalidate = revalidateCatalog
): Promise<
  | { ok: true; zatenPaid: boolean; order: typeof orders.$inferSelect | null }
  | { ok: false }
> {
  if (!database) {
    console.warn('[orders] DATABASE_URL yok — paid işaretlenemedi', { orderNo });
    return { ok: false };
  }

  const updated = await database.transaction(async (tx) => {
    await lockOrderPayments(tx);
    const [current] = await tx.select().from(orders).where(eq(orders.orderNo, orderNo)).for('update');
    if (!current || current.status !== 'pending') return null;

    for (const item of current.items) {
      const [stockRow] = await tx
        .update(inventory)
        .set({
          stock: sql`${inventory.stock} - ${item.adet}`,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(inventory.productId, item.productId),
            eq(inventory.variantId, item.variantId),
            sql`${inventory.stock} >= ${item.adet}`
          )
        )
        .returning({
          stock: inventory.stock,
        });
      if (!stockRow) {
        throw new Error(`Yetersiz stok: ${item.productId}/${item.variantId}`);
      }
      await tx.insert(stockMovements).values({
        productId: item.productId,
        variantId: item.variantId,
        delta: -item.adet,
        previousStock: stockRow.stock + item.adet,
        newStock: stockRow.stock,
        source: 'sale',
        reason: 'Ödeme onaylandı',
        reference: orderNo,
        createdBy: 'system:payment-callback',
      });
      const [catalogRow] = await tx
        .select()
        .from(catalogProducts)
        .where(eq(catalogProducts.id, item.productId))
        .limit(1);
      const now = new Date();
      if (catalogRow) {
        await tx
          .update(catalogProducts)
          .set({
            data: {
              ...catalogRow.data,
              variants: catalogRow.data.variants.map((variant) =>
                variant.id === item.variantId
                  ? { ...variant, stock: stockRow.stock }
                  : variant
              ),
              updatedAt: now.toISOString(),
            },
            updatedAt: now,
          })
          .where(eq(catalogProducts.id, item.productId));
      } else {
        const staticProduct = PRODUCTS.find(
          (product) => product.id === item.productId
        );
        if (staticProduct) {
          await tx.insert(catalogProducts).values({
            id: staticProduct.id,
            slug: staticProduct.slug,
            published: !staticProduct.hidden,
            data: {
              ...staticProduct,
              variants: staticProduct.variants.map((variant) =>
                variant.id === item.variantId
                  ? { ...variant, stock: stockRow.stock }
                  : variant
              ),
              createdAt: staticProduct.createdAt.toISOString(),
              updatedAt: now.toISOString(),
            },
          });
        }
      }
    }

    const [paid] = await tx
      .update(orders)
      .set({
        status: 'paid',
        paymentProviderId: paymentProviderId ?? null,
        paidAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(orders.orderNo, orderNo), eq(orders.status, 'pending')))
      .returning();
    if (paid) await enqueueEmail(tx, paid.id, 'order_confirmation', `${paid.orderNo}/paid`, buildOrderConfirmationEmail(paid));
    return paid ?? null;
  });

  if (updated) {
    invalidate();
    // Bu çağrı pending → paid geçişini yaptı (ilk kez).
    return { ok: true, zatenPaid: false, order: updated };
  }

  // 0 satır: ya kayıt yok ya zaten paid/failed. Durumu kontrol et.
  const [mevcut] = await database
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
  return db.transaction(async (tx) => {
    await lockOrderPayments(tx);
    const res = await tx.update(orders)
      .set({ status: 'failed', updatedAt: new Date() })
      .where(and(eq(orders.orderNo, orderNo), eq(orders.status, 'pending')))
      .returning({ id: orders.id });
    return res.length > 0;
  });
}
