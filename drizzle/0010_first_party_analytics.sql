CREATE TABLE IF NOT EXISTS "analytics_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "session_id" text NOT NULL,
  "event_name" text NOT NULL,
  "product_id" text,
  "value" numeric(10, 2),
  "path" text NOT NULL,
  "source" text DEFAULT 'direct' NOT NULL,
  "medium" text DEFAULT 'none' NOT NULL,
  "campaign" text,
  "referrer_host" text,
  "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "occurred_at" timestamp with time zone NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "analytics_events_occurred_at_idx"
ON "analytics_events" ("occurred_at" DESC);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "analytics_events_session_event_idx"
ON "analytics_events" ("session_id", "event_name");
