CREATE TABLE IF NOT EXISTS "content_campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"objective" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"starts_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "campaign_items" (
	"campaign_id" uuid NOT NULL,
	"product_id" text NOT NULL,
	"channels" jsonb NOT NULL,
	"stage" text DEFAULT 'planned' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "campaign_items_campaign_id_product_id_pk" PRIMARY KEY("campaign_id","product_id")
);
--> statement-breakpoint
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'campaign_items_campaign_id_content_campaigns_id_fk'
	) THEN
		ALTER TABLE "campaign_items"
			ADD CONSTRAINT "campaign_items_campaign_id_content_campaigns_id_fk"
			FOREIGN KEY ("campaign_id")
			REFERENCES "public"."content_campaigns"("id")
			ON DELETE cascade
			ON UPDATE no action;
	END IF;
END $$;
