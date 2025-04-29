import { and, eq } from "drizzle-orm";
import db from "../db";
import { order, trade } from "../db/schema";
import { RedisManager } from "./redisManager"

export const startQueueService = async () => {
    while (true) {
        const response = await RedisManager.getInstance().popMessageFromQueue("db_processor");

        if (!response) {

        } else {
            console.log(response)
            const data = JSON.parse(response as string);
            switch (data.type) {
                case "TRADE_ADDED":
                    await db.insert(trade).values({
                        symbol: data.payload.symbol,
                        price: data.payload.price,
                        quantity: data.payload.quantity,
                        timestamp: data.payload.timestamp,
                        quoteQuantity: data.payload.quoteQuantity,
                        tradeId: data.payload.tradeId
                    });
                    break;
                case "ADD_ORDER":
                    await db.insert(order).values({
                        userId: data.payload.userId,
                        market: data.payload.market,
                        side: data.payload.side,
                        type: data.payload.type,
                        price: data.payload.price,
                        quantity: data.payload.quantity,
                        executedQuantity: data.payload.executedQuantity,
                        clientOrderId: data.payload.clientOrderId,
                        status: data.payload.status
                    });
                    break;
                case "UPDATE_ORDER":
                    const orderData = await db.query.order.findFirst({
                        where: and(eq(order.userId, data.payload.userId), eq(order.clientOrderId, data.payload.clientOrderId))
                    });
                    const newFill = parseFloat(orderData?.executedQuantity.toString()!) + parseFloat(data.payload.quantity);
                    let newStatus = "partially_filled";
                    if (newFill === parseFloat(orderData?.quantity?.toString()!)) {
                        newStatus = "filled";
                    }
                    console.log(orderData)
                    console.log(newStatus, newFill);
                    await db.update(order).set({
                        executedQuantity: newFill.toString(),
                        status: newStatus as "open" | "partially_filled" | "filled" | "cancelled"
                    }).where(and(eq(order.userId, data.payload.userId), eq(order.clientOrderId, data.payload.clientOrderId)));
                    break;
            }
        }
    }
}