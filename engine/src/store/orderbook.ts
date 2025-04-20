export interface Order {
    id: string;
    price: number;
    quantity: number;
    side: string;
    timestamp: number;
    type: string;
    clientOrderId: string;
    userId: string;
    filled: number;
    timeInForce: string;
}

export interface Fill {
    price: number;
    quantity: number;
    tradeId: number;
    otherUserId: string;
    clientOrderId: string
}

export interface AddOrderResponse {
    executedQuantity: number;
    fills: Fill[];
}

export class OrderBook {
    private bids: Order[] = [];
    private asks: Order[] = [];
    private market: string;
    private lastTradeId: number;
    private currentPrice: number = 0;
    private baseAsset: string;
    private quoteAsset: string = 'USDC';

    constructor(baseAsset: string, market: string, bids: Order[], asks: Order[], currentPrice: number, lastTradeId: number) {
        this.market = market;
        this.asks = asks;
        this.baseAsset = baseAsset;
        this.lastTradeId = lastTradeId || 0;
        this.currentPrice = currentPrice || 0;
    }

    ticker() {
        return `${this.baseAsset}_${this.quoteAsset}`
    }

    getSnapshot() {
        return {
            baseAsset: this.baseAsset,
            bids: this.bids,
            asks: this.asks,
            lastTradeId: this.lastTradeId,
            currentPrice: this.currentPrice
        }
    }

    //addOrder function takes input order and return 
    addOrder(order: Order): AddOrderResponse {
        if (order.side === 'buy') {
            const { executedQuantity, fills } = this.matchBid(order); //getting executed orders and all fills
            if (executedQuantity === order.quantity) {
                return {
                    executedQuantity,
                    fills
                }
            } // my all order quantity is executed
            this.bids.push(order); //if all orders does not executed then push it in bids
            return {
                executedQuantity,
                fills
            }
        } else {
            const { executedQuantity, fills } = this.matchAsk(order);
            order.filled = executedQuantity;
            if (executedQuantity === order.quantity) {
                return {
                    executedQuantity,
                    fills
                }
            }
            this.asks.push(order);
            return {
                executedQuantity,
                fills
            }
        }
    }

    matchBid(order: Order): AddOrderResponse {
        const fills: Fill[] = [];
        let executedQuantity = 0;
        for (let i = 0; i < this.asks.length; i++) {
            if (this.asks[i].price <= order.price && executedQuantity < order.quantity && this.asks[i].userId !== order.userId) {
                const filledQuantity = Math.min(order.quantity - executedQuantity, this.asks[i].quantity); //get the quantity that can be filled
                executedQuantity = executedQuantity + filledQuantity;
                this.asks[i].filled += filledQuantity;
                fills.push({
                    price: this.asks[i].price,
                    quantity: filledQuantity,
                    tradeId: this.lastTradeId + 1,
                    otherUserId: this.asks[i].userId,
                    clientOrderId: this.asks[i].clientOrderId
                })
            }
        }
        //check which asks are all filled and remove them from asks. Todo optimize this.
        for (let i = 0; i < this.asks.length; i++) {
            if (this.asks[i].filled === this.asks[i].quantity) {
                this.asks.splice(i, 1);
                i--;
            }
        }
        return {
            executedQuantity,
            fills
        }
    }

    matchAsk(order: Order): AddOrderResponse {
        const fills: Fill[] = [];
        let executedQuantity = 0;
        for (let i = 0; i < this.bids.length; i++) {
            if (this.bids[i].price >= order.price && executedQuantity < order.quantity && this.bids[i].userId !== order.userId) {
                const filledQuantity = Math.min(order.quantity - executedQuantity, this.bids[i].quantity);
                executedQuantity += filledQuantity;
                this.bids[i].filled += filledQuantity;
                fills.push({
                    price: this.bids[i].price,
                    quantity: filledQuantity,
                    tradeId: this.lastTradeId + 1,
                    otherUserId: this.bids[i].userId,
                    clientOrderId: this.bids[i].clientOrderId
                })
            }
        }
        for (let i = 0; i < this.bids.length; i++) {
            if (this.bids[i].filled === this.bids[i].quantity) {
                this.bids.splice(i, 1);
                i--;
            }
        }
        return {
            executedQuantity,
            fills
        }
    }
}