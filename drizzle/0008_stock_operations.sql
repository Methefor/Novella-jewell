ALTER TABLE "inventory"
ADD COLUMN IF NOT EXISTS "low_stock_threshold" integer DEFAULT 3 NOT NULL;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stock_movements" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "product_id" text NOT NULL,
  "variant_id" text NOT NULL,
  "delta" integer NOT NULL,
  "previous_stock" integer NOT NULL,
  "new_stock" integer NOT NULL,
  "source" text NOT NULL,
  "reason" text NOT NULL,
  "reference" text,
  "created_by" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "stock_movements_product_variant_created_idx"
ON "stock_movements" ("product_id", "variant_id", "created_at" DESC);
