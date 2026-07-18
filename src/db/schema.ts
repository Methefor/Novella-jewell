import { sql } from 'drizzle-orm';
import {
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

/** Sipariş kalemi — kalıcı kayıt için sadeleştirilmiş. */
export interface OrderItemRow {
  slug: string;
  ad: string;
  adet: number;
  birimFiyat: number;
}

/** Müşteri bilgisi — kargo/iletişim için. */
export interface OrderCustomerRow {
  adSoyad: string;
  email: string;
  telefon: string;
  adres: string;
  il: string;
  ilce?: string;
  not?: string;
}

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),

  /**
   * İnsan-okur sipariş no: NJ-2026-0001.
   * DB tarafında otomatik üretilir (orders_seq sequence + DEFAULT), böylece
   * eşzamanlı iki sipariş çakışmaz. Migration sequence'i oluşturur.
   */
  orderNo: text('order_no')
    .notNull()
    .unique()
    .default(
      sql`'NJ-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('orders_seq')::text, 4, '0')`
    ),

  // pending | paid | failed
  status: text('status').notNull().default('pending'),

  items: jsonb('items').$type<OrderItemRow[]>().notNull(),
  total: numeric('total', { precision: 10, scale: 2 }).notNull(),
  customer: jsonb('customer').$type<OrderCustomerRow>().notNull(),

  shopierPaymentId: text('shopier_payment_id'),
  randomNr: text('random_nr').notNull(),

  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  paidAt: timestamp('paid_at', { withTimezone: true }),
});

export type OrderRow = typeof orders.$inferSelect;
export type NewOrderRow = typeof orders.$inferInsert;
