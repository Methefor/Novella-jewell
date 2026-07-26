CREATE TABLE "inventory" (
	"product_id" text NOT NULL,
	"variant_id" text NOT NULL,
	"stock" integer NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "inventory_product_id_variant_id_pk" PRIMARY KEY("product_id","variant_id")
);
