import { and, eq } from "drizzle-orm";
import db from "../db";
import { order, trade } from "../db/schema";
import { RedisManager } from "./redisManager"

export const startQueueService = async () => {
    while (true) {
        const response = await RedisManager.getInstance().popMessageFromQueue("db_processor");
        if (!response) {

        } else {
            const data = JSON.parse(response as string);
            switch (data.type) {
                case "TRADE_ADDED":
                    await db.insert(trade).values({
                        symbol: data.data.market,
                        price: data.data.price,
                        quantity: data.data.quantity,
                        timestamp: data.data.timestamp,
                        quoteQuantity: data.data.quoteQuantity,
                        tradeId: data.data.tradeId
                    });
                case "ADD_ORDER":
                    await db.insert(order).values({
                        userId: data.data.userId,
                        market: data.data.market,
                        side: data.data.side,
                        type: data.data.type,
                        price: data.data.price,
                        quantity: data.data.quantity,
                        executedQuantity: data.data.executedQuantity,
                        clientOrderId: data.data.clientOrderId,
                        status: data.data.status
                    });
                case "UPDATE_ORDER":
                    const orderData = await db.query.order.findFirst({
                        where: and(eq(order.userId, data.data.userId), eq(order.clientOrderId, data.data.clientOrderId))
                    });
                    console.log(orderData)
            }
        }
    }
}