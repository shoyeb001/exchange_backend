import { numeric, pgTable, time, uuid, varchar } from "drizzle-orm/pg-core";

const trade = pgTable("trade", {
    id: uuid("id").defaultRandom().primaryKey(),
    symbol: varchar("symbol").notNull(),
    price: numeric("price").notNull(),
    quantity: numeric("quantity").notNull(),
    timestamp: time("timestamp").notNull(),
    quoteQuantity: numeric("quoteQuantity").notNull(),
    tradeId: varchar("tradeId").notNull()
});
export default trade;