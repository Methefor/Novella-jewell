ALTER TABLE "campaign_items"
ADD COLUMN IF NOT EXISTS "content_draft" jsonb DEFAULT '{
  "instagramCaption": "",
  "threadsPost": "",
  "cta": "",
  "hashtags": "",
  "visualDirection": ""
}'::jsonb NOT NULL;
