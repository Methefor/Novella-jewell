import { revalidateCatalog } from '@/lib/catalog-revalidation';
import { db, dbYok } from '@/db';
import {
  inventory,
  catalogProducts,
  orderEvents,
  orders,
  stockMovements,
  type OrderItemRow,
} from '@/db/schema';
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

/** Sipariş kalemi, veritabanı kataloğunda yayında bir ürün/varyant olarak bulunamadı. */
export class CatalogProductMissingError extends Error {
  constructor(message = 'Sepetinizdeki bir ürün artık satışta değil.') {
    super(message);
    this.name = 'CatalogProductMissingError';
  }
}

/**
 * Ödeme başlamadan ÖNCE pending sipariş yaratır.
 * order_no DB tarafında otomatik üretilir (NJ-2026-0001) ve döndürülür;
 * PayTR merchant_oid değeri bu sipariş numarasından üretilir.
 *
 * Katalog tek kaynağı catalogProducts'tır (ADR-013): kalemin ürünü/varyantı
 * DB'de yayında değilse sipariş AÇILMAZ (fail closed). Statik katalogdan
 * (src/data/products.ts) hiçbir kayıt üretilmez.
 */
export async function createPendingOrder(
  order: Order,
  randomNr: string,
  legalAcceptance: LegalAcceptance,
  database = db
): Promise<{ orderNo: string; id: string } | null> {
  if (!database) {
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

  const row = await database.transaction(async (tx) => {
    await lockOrderPayments(tx);
    for (const item of order.items) {
      const [catalogRow] = await tx
        .select({ data: catalogProducts.data, published: catalogProducts.published })
        .from(catalogProducts)
        .where(eq(catalogProducts.id, item.productId))
        .limit(1);
      const variant =
        catalogRow && catalogRow.published && !catalogRow.data.deletedAt
          ? catalogRow.data.variants.find((v) => v.id === item.variantId)
          : undefined;
      if (!variant) throw new CatalogProductMissingError(`${item.name} artık satışta değil.`);

      // Envanter satırı henüz yoksa başlangıç değeri veritabanı kataloğundan gelir.
      await tx
        .insert(inventory)
        .values({
          productId: item.productId,
          variantId: item.variantId,
          stock: variant.stock,
        })
        .onConflictDoNothing();
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

  // Katalog aynası eksik kalemler: tx commit olduktan SONRA loglanır (geri alınan ödeme için yanlış alarm olmaz).
  const missingMirror: { productId: string; variantId: string }[] = [];

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
        // catalogRow yoksa yalnızca görüntüleme aynası atlanır: stok defteri
        // (inventory) yukarıda atomik olarak düşüldü ve ödeme zaten alındı.
        // Statik katalogdan (PRODUCTS) DB kaydı ÜRETİLMEZ. Ödeme/stok davranışı değişmez;
        // ihlal aynı tx içinde sipariş olayı olarak kaydedilir (idempotent: yalnızca pending → paid geçişinde).
        await tx.insert(orderEvents).values({
          orderId: current.id,
          eventType: 'catalog_mirror_missing',
          toValue: `${item.productId}/${item.variantId}`,
          note: 'Ödeme onaylandı; ürün katalog kaydı bulunamadı, stok defteri düşüldü. Kataloğu kontrol edin.',
          createdBy: 'system:payment-callback',
        });
        missingMirror.push({ productId: item.productId, variantId: item.variantId });
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
    // Yalnızca sipariş no ve ürün/varyant kimliği: müşteri, ödeme veya kart verisi loglanmaz.
    for (const line of missingMirror) {
      console.error('[orders] Paid order line has no catalog record', { orderNo, ...line });
    }
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
