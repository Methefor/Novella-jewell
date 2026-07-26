'use server';

import { db, dbYok } from '@/db';
import { orders } from '@/db/schema';
import { getAdminAuth } from '@/lib/admin-auth';
import { eq } from 'drizzle-orm';
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

  await db
    .update(orders)
    .set({
      fulfillmentStatus: parsed.fulfillmentStatus,
      carrier: parsed.carrier || null,
      trackingNumber: parsed.trackingNumber || null,
      cancelledAt:
        parsed.fulfillmentStatus === 'cancelled' ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(orders.orderNo, parsed.orderNo));

  revalidatePath('/admin');
}
