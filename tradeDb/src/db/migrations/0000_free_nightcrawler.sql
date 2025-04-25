CREATE TABLE "trade" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"symbol" varchar NOT NULL,
	"side" varchar NOT NULL,
	"price" numeric NOT NULL,
	"quantity" numeric NOT NULL,
	"time" time NOT NULL
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