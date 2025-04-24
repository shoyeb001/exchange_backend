import Joi from "joi";

export const createOrderSchema = Joi.object({
    market: Joi.string().required(),
    price: Joi.number(),
    quantity: Joi.number(),
    side: Joi.string().valid("buy", "sell").required(),
    type: Joi.string().valid("limit", "market").required(),
    timeInForce: Joi.string().valid("GTC", "IOC", "FOK").required(), // GTC = Good Till Cancelled, IOC = Immediate or Cancel, FOK = Fill or Kill
});

export const cancelOrderSchema = Joi.object({
    orderId: Joi.string().required(),
    market: Joi.string().required(),
    side: Joi.string().valid("buy", "sell").required(),
});