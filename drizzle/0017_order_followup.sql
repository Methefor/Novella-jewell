ALTER TABLE orders ADD COLUMN IF NOT EXISTS provider_checked_at timestamp with time zone;
--> statement-breakpoint
ALTER TABLE orders ADD COLUMN IF NOT EXISTS provider_check_note text;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS email_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id),
  dedupe_key text NOT NULL UNIQUE,
  kind text NOT NULL,
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  attempts integer NOT NULL DEFAULT 0,
  first_attempt_at timestamp with time zone,
  next_attempt_at timestamp with time zone NOT NULL DEFAULT now(),
  locked_until timestamp with time zone,
  lease uuid,
  provider_id text,
  last_error text,
  sent_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS email_outbox_due_idx ON email_outbox (status, next_attempt_at);
