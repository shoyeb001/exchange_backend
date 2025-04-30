import { NextFunction, Response } from "express";

const tickerController = {
    async getTicker(req: any, res: Response, next: NextFunction) {
        try {
            const markets = ["BTC_USDC"];
            const tickers = await Promise.all(
                markets.map(async (market) => {
                    const rows = await fetch(`http://tradeDb:3004/ticker?symbol=${market}`);
                    const { data } = await rows.json();
                    console.log(data);
                    const open = data[0]?.price;
                    const last = data[data.length - 1]?.price;
                    const high = data.reduce((max: number, curr: any) => Math.max(max, curr?.price), 0);
                    const low = data.reduce((min: number, curr: any) => Math.min(min, curr?.price), Number.MAX_VALUE);
                    const volume = data.reduce((sum: number, curr: any) => sum + Number(curr?.quantity), 0);
                    const quoteVolume = data.reduce((sum: number, curr: any) => sum + Number(curr?.quoteQuantity), 0);
                    const change = last - open;
                    const changePercent = ((change / Number(open)) * 100).toFixed(2);
                    return {
                        symbol: market,
                        lastPrice: last.toString(),
                        openPrice: open.toString(),
                        highPrice: high.toString(),
                        lowPrice: low.toString(),
                        volume: volume,
                        quoteVolume: quoteVolume,
                        priceChange: change.toFixed(2),
                        priceChangePercent: changePercent,
                    };
                })
            )
            res.status(200).json({
                success: true,
                message: "Tickers retrieved successfully",
                data: tickers
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}
export default tickerController;