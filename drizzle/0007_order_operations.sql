ALTER TABLE "orders"
ADD COLUMN IF NOT EXISTS "operation_note" text DEFAULT '' NOT NULL;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "order_id" uuid NOT NULL,
  "event_type" text NOT NULL,
  "from_value" text,
  "to_value" text,
  "note" text DEFAULT '' NOT NULL,
  "created_by" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "order_events_order_id_orders_id_fk"
    FOREIGN KEY ("order_id")
    REFERENCES "public"."orders"("id")
    ON DELETE cascade
    ON UPDATE no action
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_events_order_id_created_at_idx"
ON "order_events" ("order_id", "created_at" DESC);
