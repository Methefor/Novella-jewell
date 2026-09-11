ALTER TABLE "orders" ADD COLUMN "checkout_reserved" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "payment_ready_at" timestamp with time zone;
--> statement-breakpoint
CREATE INDEX "orders_pending_stock_idx" ON "orders" ("status") WHERE "status" = 'pending';
