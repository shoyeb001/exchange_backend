CREATE TABLE "order" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" varchar NOT NULL,
	"market" varchar NOT NULL,
	"side" varchar NOT NULL,
	"type" varchar NOT NULL,
	"price" numeric NOT NULL,
	"quantity" numeric NOT NULL,
	"executedQuantity" numeric NOT NULL,
	"status" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "trade" RENAME COLUMN "time" TO "timestamp";--> statement-breakpoint
ALTER TABLE "trade" ADD COLUMN "quoteQuantity" numeric NOT NULL;--> statement-breakpoint
ALTER TABLE "trade" ADD COLUMN "tradeId" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "trade" DROP COLUMN "side";