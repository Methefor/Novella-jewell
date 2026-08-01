ALTER TABLE "campaign_media_assets"
ADD COLUMN IF NOT EXISTS "product_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
ADD COLUMN IF NOT EXISTS "scheduled_at" timestamp with time zone,
ADD COLUMN IF NOT EXISTS "scheduled_channels" jsonb DEFAULT '[]'::jsonb NOT NULL;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "campaign_media_assets_scheduled_idx"
ON "campaign_media_assets" ("scheduled_at") WHERE "scheduled_at" IS NOT NULL;
