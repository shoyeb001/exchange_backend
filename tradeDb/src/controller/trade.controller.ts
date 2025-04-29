import { NextFunction, Response } from "express";
import db from "../db";

const tradeController = {
    async getTrades(req: any, res: Response, next: NextFunction) {
        try {
            const symbol = req.query.symbol;
            if (!symbol) {
                next(new Error("symbol is required"));
            }
            const trades = await db.query.trade.findMany();
            res.status(200).json({
                data: trades
            });
        } catch (error) {
            console.log(error)
            next(error);
        }
    }
}
export default tradeController;