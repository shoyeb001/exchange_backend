import { numeric, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

const order = pgTable("order", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: varchar("userId").notNull(),
    market: varchar("market").notNull(),
    side: varchar("side").notNull(),
    type: varchar("type", { enum: ["limit", "market"] }).notNull(),
    price: numeric("price").notNull(),
    quantity: numeric("quantity").notNull(),
    executedQuantity: numeric("executedQuantity").notNull(),
    status: varchar("status", { enum: ["open", "partially_filled", "filled", "cancelled"] }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
})

export default order;