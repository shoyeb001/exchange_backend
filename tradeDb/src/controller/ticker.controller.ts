import { NextFunction, Response } from "express";
import db from "../db";
import { and, asc, eq, gte } from "drizzle-orm";
import { trade } from "../db/schema";

const tickerController = {
    async getTicker(req: any, res: Response, next: NextFunction) {
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        try {
            const symbol = req.query.symbol;
            console.log("symbol", symbol);
            const rows = await db.query.trade.findMany({
                columns: {
                    price: true,
                    quantity: true,
                    quoteQuantity: true,
                    timestamp: true
                },
                where: and(eq(trade.symbol, symbol), gte(trade.timestamp, oneDayAgo)),
                orderBy: [asc(trade.timestamp)],
            })
            console.log("rows", rows);
            res.status(200).json({
                data: rows
            });
        } catch (error) {
            next(error);
        }
    }
}
export default tickerController;