import { sql } from 'drizzle-orm';
import {
  boolean,
  integer,
  jsonb,
  numeric,
  primaryKey,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import type { Product } from '@/types/product';

/** Sipariş kalemi — kalıcı kayıt için sadeleştirilmiş. */
export interface OrderItemRow {
  productId: string;
  variantId: string;
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
  // new | preparing | shipped | delivered | cancelled | returned
  fulfillmentStatus: text('fulfillment_status').notNull().default('new'),
  carrier: text('carrier'),
  trackingNumber: text('tracking_number'),
  operationNote: text('operation_note').notNull().default(''),

  items: jsonb('items').$type<OrderItemRow[]>().notNull(),
  total: numeric('total', { precision: 10, scale: 2 }).notNull(),
  customer: jsonb('customer').$type<OrderCustomerRow>().notNull(),

  shopierPaymentId: text('shopier_payment_id'),
  randomNr: text('random_nr').notNull(),

  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  paidAt: timestamp('paid_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
  refundedAt: timestamp('refunded_at', { withTimezone: true }),
  refundAmount: numeric('refund_amount', { precision: 10, scale: 2 }),
  refundStatus: text('refund_status'),
  refundReference: text('refund_reference'),
});

export const orderEvents = pgTable('order_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  eventType: text('event_type').notNull(),
  fromValue: text('from_value'),
  toValue: text('to_value'),
  note: text('note').notNull().default(''),
  createdBy: text('created_by').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const inventory = pgTable(
  'inventory',
  {
    productId: text('product_id').notNull(),
    variantId: text('variant_id').notNull(),
    stock: integer('stock').notNull(),
    lowStockThreshold: integer('low_stock_threshold').notNull().default(3),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.productId, table.variantId] })]
);

export const stockMovements = pgTable('stock_movements', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: text('product_id').notNull(),
  variantId: text('variant_id').notNull(),
  delta: integer('delta').notNull(),
  previousStock: integer('previous_stock').notNull(),
  newStock: integer('new_stock').notNull(),
  source: text('source').notNull(),
  reason: text('reason').notNull(),
  reference: text('reference'),
  createdBy: text('created_by').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const adminAuditLogs = pgTable('admin_audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  actorId: text('actor_id').notNull(),
  actorEmail: text('actor_email').notNull(),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  summary: text('summary').notNull(),
  metadata: jsonb('metadata')
    .$type<Record<string, string | number | boolean | null>>()
    .notNull()
    .default({}),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type AnalyticsEventName =
  | 'page_view'
  | 'view_item'
  | 'add_to_cart'
  | 'begin_checkout';

export const analyticsEvents = pgTable('analytics_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: text('session_id').notNull(),
  eventName: text('event_name').$type<AnalyticsEventName>().notNull(),
  productId: text('product_id'),
  value: numeric('value', { precision: 10, scale: 2 }),
  path: text('path').notNull(),
  source: text('source').notNull().default('direct'),
  medium: text('medium').notNull().default('none'),
  campaign: text('campaign'),
  referrerHost: text('referrer_host'),
  metadata: jsonb('metadata')
    .$type<Record<string, string | number | boolean | null>>()
    .notNull()
    .default({}),
  occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type ProductMediaKind =
  | 'studio'
  | 'model'
  | 'lifestyle'
  | 'campaign';

export const productMediaAssets = pgTable('product_media_assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: text('product_id').notNull(),
  url: text('url').notNull(),
  source: text('source').notNull().default('pomelli'),
  kind: text('kind').$type<ProductMediaKind>().notNull().default('studio'),
  status: text('status').notNull().default('review'),
  formApproved: boolean('form_approved').notNull().default(false),
  colorApproved: boolean('color_approved').notNull().default(false),
  detailApproved: boolean('detail_approved').notNull().default(false),
  notes: text('notes').notNull().default(''),
  createdBy: text('created_by').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

type StoredProduct = Omit<Product, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

export const catalogProducts = pgTable('catalog_products', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  data: jsonb('data').$type<StoredProduct>().notNull(),
  published: boolean('published').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type CampaignChannel =
  | 'instagram-reels'
  | 'instagram-carousel'
  | 'instagram-story'
  | 'threads';

export type CampaignContentDraft = {
  instagramCaption: string;
  threadsPost: string;
  cta: string;
  hashtags: string;
  visualDirection: string;
};

export const contentCampaigns = pgTable('content_campaigns', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  objective: text('objective').notNull().default(''),
  status: text('status').notNull().default('draft'),
  startsAt: timestamp('starts_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const campaignItems = pgTable(
  'campaign_items',
  {
    campaignId: uuid('campaign_id')
      .notNull()
      .references(() => contentCampaigns.id, { onDelete: 'cascade' }),
    productId: text('product_id').notNull(),
    channels: jsonb('channels').$type<CampaignChannel[]>().notNull(),
    stage: text('stage').notNull().default('planned'),
    notes: text('notes').notNull().default(''),
    contentDraft: jsonb('content_draft')
      .$type<CampaignContentDraft>()
      .notNull()
      .default({
        instagramCaption: '',
        threadsPost: '',
        cta: '',
        hashtags: '',
        visualDirection: '',
      }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.campaignId, table.productId] }),
  ]
);

export type OrderRow = typeof orders.$inferSelect;
export type NewOrderRow = typeof orders.$inferInsert;
export type OrderEventRow = typeof orderEvents.$inferSelect;
export type StockMovementRow = typeof stockMovements.$inferSelect;
export type AdminAuditLogRow = typeof adminAuditLogs.$inferSelect;
export type AnalyticsEventRow = typeof analyticsEvents.$inferSelect;
export type ProductMediaAssetRow = typeof productMediaAssets.$inferSelect;
export type ContentCampaignRow = typeof contentCampaigns.$inferSelect;
export type CampaignItemRow = typeof campaignItems.$inferSelect;
