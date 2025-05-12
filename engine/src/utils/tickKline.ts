import { RedisManager } from "../services/redisManager"

interface Trade {
    tradeId: number;
    price: number;
    qty: number;
    market: string;
    time: number;
}

const klineBuckets: { [market: string]: Trade[] } = {};
export const handelNewTrade = (trade: Trade) => {
    if (!klineBuckets[trade.market]) {
        klineBuckets[trade.market] = [];
    }
    klineBuckets[trade.market].push(trade);
}
export const startTickKline = () => {
    setInterval(() => {
        const now = Date.now();
        Object.entries(klineBuckets).forEach(([market, trades]) => {
            if (trades.length === 0) return;
            const sortedTrades = trades.sort((a, b) => a.time - b.time);
            const open = sortedTrades[0].price;
            const close = sortedTrades[sortedTrades.length - 1].price;
            const high = sortedTrades.reduce((acc, curr) => Math.max(acc, curr.price), open);
            const low = sortedTrades.reduce((acc, curr) => Math.min(acc, curr.price), close);
            const volume = sortedTrades.reduce((acc, curr) => acc + curr.qty, 0);
            const quoteVolume = sortedTrades.reduce((acc, curr) => acc + curr.price * curr.qty, 0);
            const startTime = new Date(Math.floor(sortedTrades[0].time / 6000) * 6000);
            const endTime = new Date(startTime.getTime() + 60000);
            RedisManager.getInstance().sendToApi("KLINE_TICKER", {
                type: "kline_ticker",
                payload: {
                    market,
                    open,
                    close,
                    high,
                    low,
                    volume,
                    quoteVolume,
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString()
                }
            });
            console.log(klineBuckets);
            klineBuckets[market] = [];
        })
    }, 60 * 1000);
}