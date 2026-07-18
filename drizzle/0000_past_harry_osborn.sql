-- order_no DEFAULT'unun kullandığı sequence. Tablodan ÖNCE oluşturulmalı,
-- yoksa CREATE TABLE'daki nextval('orders_seq') başarısız olur.
CREATE SEQUENCE IF NOT EXISTS "orders_seq" START WITH 1 INCREMENT BY 1;
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_no" text DEFAULT 'NJ-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('orders_seq')::text, 4, '0') NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"items" jsonb NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"customer" jsonb NOT NULL,
	"shopier_payment_id" text,
	"random_nr" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"paid_at" timestamp with time zone,
	CONSTRAINT "orders_order_no_unique" UNIQUE("order_no")
);
