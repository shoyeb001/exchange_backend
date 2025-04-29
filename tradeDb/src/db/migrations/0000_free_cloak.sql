CREATE TABLE "order" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" varchar NOT NULL,
	"market" varchar NOT NULL,
	"side" varchar NOT NULL,
	"clientOrderId" varchar NOT NULL,
	"type" varchar NOT NULL,
	"price" numeric NOT NULL,
	"quantity" numeric NOT NULL,
	"executedQuantity" numeric NOT NULL,
	"status" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trade" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"symbol" varchar NOT NULL,
	"price" numeric NOT NULL,
	"quantity" numeric NOT NULL,
	"timestamp" bigint NOT NULL,
	"quoteQuantity" numeric NOT NULL,
	"tradeId" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "userBalance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" varchar NOT NULL,
	"asset" varchar NOT NULL,
	"available" numeric DEFAULT '0' NOT NULL,
	"locked" numeric DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_asset_index" ON "userBalance" USING btree ("userId","asset");