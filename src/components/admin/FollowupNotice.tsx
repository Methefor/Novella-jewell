import { db, dbYok } from '@/db';
import { emailOutbox, orders } from '@/db/schema';
import { count, eq, inArray, or } from 'drizzle-orm';
import Link from 'next/link';

/** Render only inside pages that have already required admin access. */
export default async function FollowupNotice() {
  if (dbYok) return null;
  const [[mail], [order]] = await Promise.all([
    db.select({ count: count() }).from(emailOutbox).where(inArray(emailOutbox.status, ['pending', 'retry', 'review'])),
    db.select({ count: count() }).from(orders).where(or(eq(orders.status, 'pending'), inArray(orders.refundStatus, ['processing', 'submitted', 'review']))),
  ]);
  return <Link href="/admin/takip" className="my-5 block rounded-xl border border-[#d8cdbb] bg-white px-5 py-4 text-sm">
    <span className="font-semibold">Ödeme ve bildirim takibi →</span>
    <span className="ml-3 text-neutral-600">{order.count} sonuç bekleyen sipariş · {mail.count} bekleyen/kontrol gerektiren e-posta</span>
  </Link>;
}
