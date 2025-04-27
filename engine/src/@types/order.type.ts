export const CREATE_ORDER = "CREATE_ORDER";
export const CANCEL_ORDER = "CANCEL_ORDER";
export const ON_RAMP = "ON_RAMP";

export const GET_DEPTH = "GET_DEPTH";
export const GET_OPEN_ORDERS = "GET_OPEN_ORDERS";

export const GET_TRADES = "GET_TRADES";


export type MessageFromApi = {
    type: typeof CREATE_ORDER,
    data: {
        market: string,
        side: string,
        clientOrderId: string,
        type: string,
        price: number,
        quantity: number,
        timeInForce: string,
        userId: string,
        timeStamp: number
    } | {
        type: typeof CANCEL_ORDER,
        data: {
            orderId: string,
            market: string
        }
    }
}