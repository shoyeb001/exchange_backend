import { RedisManager } from "./redisManager";
import { Fill, Order, OrderBook } from "../store/orderbook";
import { CANCEL_ORDER, CREATE_ORDER, GET_DEPTH, GET_OPEN_ORDERS, MessageFromApi, ON_RAMP } from "../@types/order.type";
import { TRADING_PAIRS } from "../utils/tradingPairs";
import fs from 'fs';
import dotenv from "dotenv";
import { handelNewTrade } from "../utils/tickKline";

dotenv.config();
export const BASE_CURRENCY = 'USDC';
interface UserBalance {
    [key: string]: {
        available: number;
        locked: number;
    }
}

export class TradeManager {
    private orderBooks: OrderBook[] = [];
    private userBalances: Map<string, UserBalance> = new Map();

    constructor() {
        console.log("Code updating")
        console.log(process.env.WITH_SNAPSHOT)
        let snapshot = null;
        try {
            if (process.env.WITH_SNAPSHOT) {
                console.log("snapshots exits")
                snapshot = fs.readFileSync('./data/snapshot.json');
                this.orderBooks = JSON.parse(snapshot.toString()).orderBooks.map((orderBook: any) => {
                    return new OrderBook(orderBook.baseAsset, orderBook.quoteAsset, orderBook.bids, orderBook.asks, orderBook.currentPrice, orderBook.lastTradeId);
                })
            } else {
                this.orderBooks = TRADING_PAIRS.map(pair => new OrderBook(pair.base, pair.quote, [], [], 0, 0))
            }
        } catch (error) {
            console.log("No snapshot found")
        }

        if (snapshot) {
            const snapshotData = JSON.parse(snapshot.toString());
            this.userBalances = new Map(snapshotData.userBalances);
        }
        setInterval(() => {
            this.saveSnapshot();
        }, 1000 * 3);
    }

    saveSnapshot() {
        const snapshotData = {
            orderBooks: this.orderBooks.map(orderBook => orderBook.getSnapshot()),
            userBalances: Array.from(this.userBalances.entries())
        }
        fs.writeFileSync('./data/snapshot.json', JSON.stringify(snapshotData));
    }


    process({ message, clientId }: { message: any, clientId: string }) {
        switch (message.type) {
            case CREATE_ORDER:
                try {
                    const { executedQuantity, fills, clientOrderId } = this.createOrder(message.data.market, message.data.price, message.data.quantity, message.data.side, message.data.userId, message.data.clientOrderId, message.data.timeInForce, message.data.type);
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: "ORDER_PLACED",
                        payload: {
                            executedQuantity,
                            fills,
                            clientOrderId
                        }
                    });
                } catch (error) {
                    console.log(error);
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: "ORDER_CANCELLED",
                        payload: {
                            orderId: "",
                            executedQty: 0,
                            remainingQty: 0
                        }
                    });
                }
                break;
            case ON_RAMP:
                console.log("Running on ramp")
                const userId = message.data.userId;
                const amount = message.data.amount;
                const response = this.addFunds(userId, amount);
                RedisManager.getInstance().sendToApi(clientId, {
                    type: "FUND_ADDED",
                    payload: { response }
                });
                break;
            case GET_OPEN_ORDERS:
                try {
                    const openOrderBook = this.orderBooks.find(book => book.ticker() === message.data.market);
                    if (!openOrderBook) {
                        throw new Error("No market found")
                    }
                    const openOrders = openOrderBook.getOpenOrders(message.data.userId);
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: "OPEN_ORDERS",
                        payload: openOrders
                    })
                } catch (error) {
                    console.log(error);
                }
            case GET_DEPTH:
                try {
                    const market = message.data.market;
                    const orderBook = this.orderBooks.find(book => book.ticker() === market);
                    if (!orderBook) {
                        throw new Error("No market found");
                    }
                    const depth = orderBook.getDepth();
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: "DEPTH",
                        payload: depth
                    });
                } catch (error) {
                    console.log(error);
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: "DEPTH",
                        payload: {
                            bids: [],
                            asks: []
                        }
                    });
                }
            case CANCEL_ORDER:
                try {
                    const orderId = message.data.orderId;
                    const market = message.data.market;
                    const orderBook = this.orderBooks.find(book => book.ticker() === market);
                    const quoteAsset = market.split('_')[1];
                    if (!orderBook) {
                        throw new Error("No market found");
                    }
                    if (message.data.side === "buy") {
                        const order = orderBook.getOrder(orderId, "buy");
                        if (!order) {
                            throw new Error("Invalid order")
                        }
                        const price = orderBook.cancelBid(order);
                        const leftQtyPrice = (order.quantity - order.filled) * price!;
                        this.userBalances.get(order.userId)![BASE_CURRENCY].available += leftQtyPrice;
                        this.userBalances.get(order.userId)![BASE_CURRENCY].locked -= leftQtyPrice;
                        if (price) {
                            //update market depth
                        }
                        RedisManager.getInstance().sendToApi(clientId, {
                            type: "ORDER_CANCELLED",
                            payload: {
                                orderId,
                                executedQty: order.filled,
                                remainingQty: order.quantity - order.filled
                            }
                        })
                    } else {
                        const order = orderBook.getOrder(orderId, "sale");
                        if (!order) {
                            throw new Error("Invalid order");
                        }
                        const price = orderBook.cancelAsk(order);
                        const leftQty = (order.quantity - order.filled);
                        this.userBalances.get(order.userId)![quoteAsset].available += leftQty;
                        this.userBalances.get(order.userId)![quoteAsset].locked -= leftQty;
                        if (price) {
                            //update market depth
                        }
                        RedisManager.getInstance().sendToApi(clientId, {
                            type: "ORDER_CANCELLED",
                            payload: {
                                orderId,
                                executedQty: order.filled,
                                remainingQty: order.quantity - order.filled
                            }
                        })
                    }
                } catch (error) {
                    console.log(error);
                }
        }
    }

    createOrder(market: string, price: number, quantity: number, side: string, userId: string, clientOrderId: string, timeInForce: string, type: string) {
        const orderBook = this.orderBooks.find(book => book.ticker() === market);
        const baseAsset = market.split('_')[0];
        const quoteAsset = market.split('_')[1];
        if (!orderBook) {
            throw new Error("No Market Found");
        }
        this.checkAndLockFunds(baseAsset, quoteAsset, side, userId, price, quantity);
        const order: Order = {
            id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            side,
            price,
            quantity,
            userId,
            clientOrderId,
            filled: 0,
            timeInForce,
            type,
            timestamp: Date.now()
        }
        console.log(order);
        const { executedQuantity, fills } = orderBook.addOrder(order);
        this.updateBalance(userId, quoteAsset, baseAsset, side, fills, executedQuantity)
        this.createDbTrade(fills, userId, market);
        //addDBOrders
        this.addDbOrder(order, market, executedQuantity);
        //updateDBOrders
        this.updateOrderDb(fills);
        //uplish ws depth update
        this.publishWsDepthUpdate(market, side, price, fills);
        //publish ws trades
        this.publishWsTradeUpdate(market, fills);
        return {
            executedQuantity,
            fills,
            clientOrderId: order.clientOrderId,
        }
    }

    addDbOrder(order: Order, market: string, executedQty: number) {
        console.log(order)
        RedisManager.getInstance().pushMessage({
            type: "ADD_ORDER",
            payload: {
                userId: order.userId,
                clientOrderId: order.clientOrderId,
                market: market,
                side: order.side,
                type: order.type,
                price: order.price,
                quantity: order?.quantity,
                executedQuantity: executedQty,
                status: this.generateOrderStatus(order.quantity, executedQty)
            }
        });
    }

    updateOrderDb(fills: Fill[]) {
        fills.forEach(fill => {
            RedisManager.getInstance().pushMessage({
                type: "UPDATE_ORDER",
                payload: {
                    userId: fill.otherUserId,
                    clientOrderId: fill.clientOrderId,
                    side: fill.isBuyerMaker ? "buy" : "sell",
                    quantity: fill.quantity,
                }
            })
        })
    }


    generateOrderStatus(qty: number, executedQuantity: number) {
        if (executedQuantity === 0) {
            return "open"
        } else if (executedQuantity === qty) {
            return "filled"
        } else if (executedQuantity < qty) {
            return "partially_filled"
        }
    }

    createDbTrade(fills: Fill[], userId: string, market: string) {
        fills.forEach(fill => {
            handelNewTrade({
                tradeId: fill.tradeId,
                price: fill.price,
                qty: fill.quantity,
                market: market,
                time: Date.now()
            });
            RedisManager.getInstance().pushMessage({
                type: "TRADE_ADDED",
                payload: {
                    symbol: market,
                    tradeId: fill.tradeId,
                    price: fill.price,
                    quantity: fill.quantity,
                    quoteQuantity: fill.quoteQuantity,
                    timestamp: Date.now()
                }
            })
        })
    }

    updateBalance(userId: string, quoteAsset: string, baseAsset: string, side: string, fills: Fill[], executedQuantity: number) {
        if (side === "buy") {
            fills?.forEach(fill => {
                //BTC remove from saler locked balance
                if (!this.userBalances.get(userId)?.[baseAsset]) {
                    this.userBalances.get(userId)![baseAsset] = {
                        available: 0,
                        locked: 0
                    }
                }
                this.userBalances.get(fill.otherUserId)![baseAsset].locked -= fill.quantity;
                //BTC add to buyer available balance

                this.userBalances.get(userId)![baseAsset].available += fill.quantity;
                //USDC remove from buyer locked balance
                this.userBalances.get(userId)![quoteAsset].locked -= fill.price * fill.quantity;
                //USDC available to seller balance
                this.userBalances.get(fill.otherUserId)![quoteAsset].available += fill.price * fill.quantity;
            })
        } else {
            fills?.forEach(fill => {
                //BTC remove from seller locked
                this.userBalances.get(userId)![baseAsset].locked -= fill.quantity;
                //BTC add to seller available
                if (!this.userBalances.get(fill.otherUserId)?.[baseAsset]) {
                    this.userBalances.get(fill.otherUserId)![baseAsset] = {
                        available: 0,
                        locked: 0
                    }
                }
                this.userBalances.get(fill.otherUserId)![baseAsset].available += fill.quantity;
                //USDC remove from buyer locked

                this.userBalances.get(fill.otherUserId)![quoteAsset].locked -= fill.price * fill.quantity;
                //USDC add to buyer available
                this.userBalances.get(userId)![quoteAsset].available += fill.price * fill.quantity;
            })
        }
    }

    checkAndLockFunds(baseAsset: string, quoteAsset: string, side: string, userId: string, price: number, quantity: number) {
        if (side === "buy") {
            console.log(this.userBalances.get(userId)?.[baseAsset]?.available);
            console.log(this.userBalances.get(userId)?.[quoteAsset]?.available);
            console.log(this.userBalances);
            if ((this.userBalances.get(userId)?.[quoteAsset]?.available || 0) < quantity * price) {
                throw new Error("Insufficient Funds");
            }
            this.userBalances.get(userId)![quoteAsset].available -= quantity * price;
            this.userBalances.get(userId)![quoteAsset].locked += quantity * price;
        } else {
            console.log(this.userBalances.get(userId)?.[baseAsset]?.available);
            console.log(this.userBalances.get(userId)?.[quoteAsset]?.available);
            console.log(this.userBalances);

            if ((this.userBalances.get(userId)?.[baseAsset]?.available || 0) < quantity) {
                throw new Error("Insufficient assets");
            }
            this.userBalances.get(userId)![baseAsset].available -= quantity;
            this.userBalances.get(userId)![baseAsset].locked += quantity;
        }
    }

    publishWsDepthUpdate(market: string, side: string, price: number, fills: Fill[]) {
        const orderBook = this.orderBooks.find(book => book.ticker() === market);
        if (!orderBook) {
            throw new Error("No market found");
        }
        const depth = orderBook.getDepth();
        if (side === "buy") {
            const updatedAsks = depth.asks.filter(ask => fills.map(fill => fill.price).includes(parseFloat(ask[0])));
            const updatedBids = depth.bids.find(bid => parseFloat(bid[0]) === price);
            //publish to ws
            RedisManager.getInstance().publishMessage(`depth_${market}`, {
                stream: `depth@${market}`,
                data: {
                    e: "depth",
                    b: updatedBids ? [updatedBids] : [],
                    a: updatedAsks,
                }
            })
        } else {
            const updatedAsks = depth.asks.find(ask => parseFloat(ask[0]) === price);
            const updatedBids = depth.bids.filter(bid => fills.map(fill => fill.price).includes(parseFloat(bid[0])));
            //publish to ws
            RedisManager.getInstance().publishMessage(`depth_${market}`, {
                stream: `depth@${market}`,
                data: {
                    e: "depth",
                    b: updatedBids,
                    a: updatedAsks ? [updatedAsks] : [],
                }
            })
        }
    }

    publishWsTradeUpdate(market: string, fills: Fill[]) {
        fills.forEach((fill) => {
            RedisManager.getInstance().publishMessage(`trade_${market}`, {
                stream: `trade@${market}`,
                data: {
                    e: "trade",
                    t: fill.tradeId,
                    m: fill.isBuyerMaker,
                    p: fill.price.toString(),
                    q: fill.quantity.toString(),
                    s: market
                }
            })
        })
    }

    addFunds(userId: string, amount: number) {
        const userBalance = this.userBalances.get(userId);
        if (!userBalance) {
            this.userBalances.set(userId, {
                [BASE_CURRENCY]: {
                    available: amount,
                    locked: 0
                }
            });
            return userBalance;
        } else {
            userBalance[BASE_CURRENCY].available += amount;
            return userBalance
        }
    }
}