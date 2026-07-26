ALTER TABLE "orders" ADD COLUMN "fulfillment_status" text DEFAULT 'new' NOT NULL;
ALTER TABLE "orders" ADD COLUMN "carrier" text;
ALTER TABLE "orders" ADD COLUMN "tracking_number" text;
ALTER TABLE "orders" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;
ALTER TABLE "orders" ADD COLUMN "cancelled_at" timestamp with time zone;
ALTER TABLE "orders" ADD COLUMN "refunded_at" timestamp with time zone;
ALTER TABLE "orders" ADD COLUMN "refund_amount" numeric(10, 2);
