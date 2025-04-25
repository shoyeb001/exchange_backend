import { numeric, pgTable, time, uuid, varchar } from "drizzle-orm/pg-core";

const trade = pgTable("trade", {
    id: uuid("id").defaultRandom().primaryKey(),
    symbol: varchar("symbol").notNull(),
    side: varchar("side", { enum: ['buy', 'sell'] }).notNull(),
    price: numeric("price").notNull(),
    quantity: numeric("quantity").notNull(),
    time: time("time").notNull(),
});
export default trade;