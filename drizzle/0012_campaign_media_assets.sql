CREATE TABLE IF NOT EXISTS "campaign_media_assets" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "campaign_id" uuid NOT NULL REFERENCES "content_campaigns"("id") ON DELETE CASCADE,
  "url" text NOT NULL,
  "pathname" text NOT NULL,
  "filename" text NOT NULL,
  "format" text NOT NULL,
  "size" integer NOT NULL,
  "status" text DEFAULT 'review' NOT NULL,
  "created_by" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "campaign_media_assets_campaign_created_idx"
ON "campaign_media_assets" ("campaign_id", "created_at" DESC);
