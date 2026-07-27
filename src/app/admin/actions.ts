'use server';

import { db, dbYok } from '@/db';
import { inventory, orderEvents, orders } from '@/db/schema';
import { getAdminAuth } from '@/lib/admin-auth';
import { refundPayTRPayment } from '@/lib/checkout/paytr';
import { sendOrderStatusEmail } from '@/lib/email';
import { and, eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const updateSchema = z.object({
  orderNo: z.string().regex(/^NJ-\d{4}-\d+$/),
  fulfillmentStatus: z.enum([
    'new',
    'preparing',
    'shipped',
    'delivered',
    'cancelled',
    'returned',
  ]),
  carrier: z.string().trim().max(80).optional(),
  trackingNumber: z.string().trim().max(120).optional(),
});

export async function updateOrderStatus(formData: FormData) {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') throw new Error('Yetkisiz işlem.');
  if (dbYok) throw new Error('Veritabanı bağlantısı yok.');

  const parsed = updateSchema.parse({
    orderNo: formData.get('orderNo'),
    fulfillmentStatus: formData.get('fulfillmentStatus'),
    carrier: formData.get('carrier'),
    trackingNumber: formData.get('trackingNumber'),
  });

  const [current] = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNo, parsed.orderNo))
    .limit(1);
  if (!current) throw new Error('Sipariş bulunamadı.');
  if (current.status !== 'paid') {
    throw new Error('Ödemesi tamamlanmamış sipariş ilerletilemez.');
  }

  const [updated] = await db
    .update(orders)
    .set({
      fulfillmentStatus: parsed.fulfillmentStatus,
      carrier: parsed.carrier || null,
      trackingNumber: parsed.trackingNumber || null,
      cancelledAt:
        parsed.fulfillmentStatus === 'cancelled' ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(orders.orderNo, parsed.orderNo))
    .returning();

  if (updated && current.fulfillmentStatus !== updated.fulfillmentStatus) {
    await db.insert(orderEvents).values({
      orderId: updated.id,
      eventType: 'fulfillment_status',
      fromValue: current.fulfillmentStatus,
      toValue: updated.fulfillmentStatus,
      note:
        parsed.fulfillmentStatus === 'shipped'
          ? [parsed.carrier, parsed.trackingNumber].filter(Boolean).join(' · ')
          : '',
      createdBy: admin.email,
    });
    try {
      await sendOrderStatusEmail(updated);
    } catch (error) {
      console.error('[admin] durum e-postası gönderilemedi', {
        orderNo: updated.orderNo,
        error,
      });
    }
  }

  revalidatePath('/admin');
  revalidatePath('/admin/siparisler');
}

export async function updateOrderNote(formData: FormData) {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') throw new Error('Yetkisiz işlem.');
  if (dbYok) throw new Error('Veritabanı bağlantısı yok.');

  const parsed = z
    .object({
      orderNo: z.string().regex(/^NJ-\d{4}-\d+$/),
      operationNote: z.string().trim().max(2000),
    })
    .parse({
      orderNo: formData.get('orderNo'),
      operationNote: formData.get('operationNote'),
    });

  const [current] = await db
    .select({ id: orders.id, operationNote: orders.operationNote })
    .from(orders)
    .where(eq(orders.orderNo, parsed.orderNo))
    .limit(1);
  if (!current) throw new Error('Sipariş bulunamadı.');

  await db.transaction(async (tx) => {
    await tx
      .update(orders)
      .set({ operationNote: parsed.operationNote, updatedAt: new Date() })
      .where(eq(orders.id, current.id));
    await tx.insert(orderEvents).values({
      orderId: current.id,
      eventType: 'operation_note',
      fromValue: current.operationNote,
      toValue: parsed.operationNote,
      note: 'Operasyon notu güncellendi.',
      createdBy: admin.email,
    });
  });

  revalidatePath('/admin/siparisler');
}

export async function refundOrder(formData: FormData) {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') throw new Error('Yetkisiz işlem.');
  if (dbYok) throw new Error('Veritabanı bağlantısı yok.');

  const parsed = z
    .object({
      orderNo: z.string().regex(/^NJ-\d{4}-\d+$/),
      confirmation: z.string(),
    })
    .parse({
      orderNo: formData.get('orderNo'),
      confirmation: formData.get('confirmation'),
    });
  if (parsed.confirmation.trim() !== parsed.orderNo) {
    throw new Error('Onay için sipariş numarasını eksiksiz yazın.');
  }

  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNo, parsed.orderNo))
    .limit(1);
  if (!order || order.status !== 'paid') throw new Error('İade edilebilir ödeme bulunamadı.');
  if (order.refundStatus === 'processing' || order.refundStatus === 'success') {
    throw new Error('Bu sipariş için iade daha önce başlatılmış.');
  }

  const reference = `NJREF${order.orderNo.replace(/\D/g, '')}`;
  const [claimed] = await db
    .update(orders)
    .set({ refundStatus: 'processing', refundReference: reference, updatedAt: new Date() })
    .where(
      and(
        eq(orders.id, order.id),
        sql`${orders.refundStatus} is null or ${orders.refundStatus} = 'failed'`
      )
    )
    .returning({ id: orders.id });
  if (!claimed) throw new Error('İade işlemi zaten yürütülüyor.');

  try {
    await refundPayTRPayment(order.orderNo, Number(order.total).toFixed(2), reference);
    const refunded = await db.transaction(async (tx) => {
      for (const item of order.items) {
        await tx
          .update(inventory)
          .set({
            stock: sql`${inventory.stock} + ${item.adet}`,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(inventory.productId, item.productId),
              eq(inventory.variantId, item.variantId)
            )
          );
      }
      const [row] = await tx
        .update(orders)
        .set({
          refundStatus: 'success',
          refundAmount: order.total,
          refundedAt: new Date(),
          fulfillmentStatus: 'returned',
          updatedAt: new Date(),
        })
        .where(and(eq(orders.id, order.id), eq(orders.refundStatus, 'processing')))
        .returning();
      return row;
    });
    if (refunded) {
      await db.insert(orderEvents).values({
        orderId: refunded.id,
        eventType: 'refund',
        fromValue: order.fulfillmentStatus,
        toValue: 'returned',
        note: `${Number(order.total).toFixed(2)} TRY tam iade`,
        createdBy: admin.email,
      });
      try {
        await sendOrderStatusEmail(refunded);
      } catch (error) {
        console.error('[admin] iade e-postası gönderilemedi', { orderNo: order.orderNo, error });
      }
    }
  } catch (error) {
    await db
      .update(orders)
      .set({ refundStatus: 'failed', updatedAt: new Date() })
      .where(and(eq(orders.id, order.id), eq(orders.refundStatus, 'processing')));
    throw error;
  }

  revalidatePath('/admin');
  revalidatePath('/admin/siparisler');
}
