import { NextFunction, Response } from "express";
import CustomErrorHandler from "../services/customErrorHandler";

const tradeController = {
    async getTrade(req: any, res: Response, next: NextFunction) {
        try {
            const symbol = req.query.symbol;
            if (!symbol) {
                next(CustomErrorHandler.invalidCredentials("symbol is required"));
            }
            const response = await fetch(`http://tradeDb:3004/trades?symbol=${symbol}`);
            res.status(200).json({
                success: true,
                message: "Trades retrieved successfully",
                data: await response.json()
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}
export default tradeController;