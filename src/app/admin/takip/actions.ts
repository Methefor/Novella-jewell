'use server';
import { getAdminAuth } from '@/lib/admin-auth';
import { reconcileOrder, runOrderFollowup } from '@/lib/order-followup';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export async function checkOrderWithPayTR(form: FormData) {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') throw new Error('Yetkisiz işlem.');
  const orderNo = z.string().regex(/^NJ-\d{4}-\d+$/).parse(form.get('orderNo'));
  await reconcileOrder(orderNo, true);
  revalidatePath('/admin/takip');
  redirect(`/admin/takip?q=${encodeURIComponent(orderNo)}`);
}

export async function checkPendingOperations() {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') throw new Error('Yetkisiz işlem.');
  await runOrderFollowup();
  revalidatePath('/admin/takip');
  revalidatePath('/admin/siparisler');
  redirect('/admin/takip?checked=1');
}
