import { numeric, pgTable, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

const userBalance = pgTable("userBalance", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: varchar("userId").notNull(),
    asset: varchar("asset").notNull(),
    available: numeric("available").notNull().default('0'),
    locked: numeric("locked").notNull().default('0')
}, (table) => ({
    userAssetIndex: uniqueIndex("user_asset_index").on(table.userId, table.asset),
}));

export default userBalance;