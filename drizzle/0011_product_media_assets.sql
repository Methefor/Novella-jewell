CREATE TABLE IF NOT EXISTS "product_media_assets" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "product_id" text NOT NULL,
  "url" text NOT NULL,
  "source" text DEFAULT 'pomelli' NOT NULL,
  "kind" text DEFAULT 'studio' NOT NULL,
  "status" text DEFAULT 'review' NOT NULL,
  "form_approved" boolean DEFAULT false NOT NULL,
  "color_approved" boolean DEFAULT false NOT NULL,
  "detail_approved" boolean DEFAULT false NOT NULL,
  "notes" text DEFAULT '' NOT NULL,
  "created_by" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_media_assets_product_created_idx"
ON "product_media_assets" ("product_id", "created_at" DESC);
