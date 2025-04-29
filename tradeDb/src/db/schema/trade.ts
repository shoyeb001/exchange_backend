import { bigint, integer, numeric, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

const trade = pgTable("trade", {
    id: uuid("id").defaultRandom().primaryKey(),
    symbol: varchar("symbol").notNull(),
    price: numeric("price").notNull(),
    quantity: numeric("quantity").notNull(),
    timestamp: bigint("timestamp", { mode: "number" }).notNull(),
    quoteQuantity: numeric("quoteQuantity").notNull(),
    tradeId: varchar("tradeId").notNull()
});
export default trade;