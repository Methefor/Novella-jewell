import { sql, type SQL } from 'drizzle-orm';
import type { OrderItem } from './types';

// A small structural interface keeps the same SQL testable against local Postgres.
export interface StockTransaction {
  execute(query: SQL): Promise<{ rows: Record<string, unknown>[] }>;
}

export class StockUnavailableError extends Error {}

/** All pending/paid/failed transitions share one transaction-scoped lock. */
export async function lockOrderPayments(tx: StockTransaction) {
  await tx.execute(sql`SELECT pg_advisory_xact_lock(71624, 1)`);
}

/** Call and insert the pending order within the SAME transaction. */
export async function reserveOrderStock(tx: StockTransaction, items: OrderItem[]) {
  await lockOrderPayments(tx);

  // Only a NEW checkout whose iframe was never released can safely expire here.
  // Issued sessions and legacy pending payments await a signed provider outcome;
  // a delayed success callback must never lose its stock reservation to a timer.
  await tx.execute(sql`
    UPDATE orders SET status = 'failed', updated_at = clock_timestamp()
    WHERE status = 'pending' AND checkout_reserved = true
      AND payment_ready_at IS NULL
      AND created_at < clock_timestamp() - interval '5 minutes'
  `);

  const grouped = new Map<string, OrderItem>();
  for (const item of items) {
    const key = JSON.stringify([item.productId, item.variantId]);
    const previous = grouped.get(key);
    grouped.set(key, { ...item, quantity: (previous?.quantity ?? 0) + item.quantity });
  }
  for (const [, item] of [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const available = await tx.execute(sql`
      SELECT stock FROM inventory
      WHERE product_id = ${item.productId} AND variant_id = ${item.variantId}
      FOR UPDATE
    `);
    const held = await tx.execute(sql`
      SELECT COALESCE(SUM((line->>'adet')::integer), 0)::integer AS quantity
      FROM orders CROSS JOIN LATERAL jsonb_array_elements(items) AS line
      WHERE status = 'pending'
        AND line->>'productId' = ${item.productId}
        AND line->>'variantId' = ${item.variantId}
    `);
    const stock = Number(available.rows[0]?.stock ?? 0);
    const reserved = Number(held.rows[0]?.quantity ?? 0);
    if (stock - reserved < item.quantity) {
      throw new StockUnavailableError(reserved > 0
        ? `${item.name} başka bir ödeme işlemi için ayrılmış olabilir. Lütfen biraz sonra yeniden deneyin.`
        : `${item.name} için yeterli stok yok.`);
    }
  }
}

/** Persist this BEFORE returning the provider iframe to the customer. */
export async function releasePaymentToCustomer(tx: StockTransaction, orderNo: string) {
  await lockOrderPayments(tx);
  const result = await tx.execute(sql`
    UPDATE orders SET payment_ready_at = clock_timestamp(), updated_at = clock_timestamp()
    WHERE order_no = ${orderNo} AND status = 'pending' AND checkout_reserved = true
      AND payment_ready_at IS NULL
      AND created_at >= clock_timestamp() - interval '5 minutes'
    RETURNING id
  `);
  return result.rows.length === 1;
}
