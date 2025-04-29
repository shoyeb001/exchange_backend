import { Response, NextFunction } from 'express';
import { cancelOrderSchema, createOrderSchema } from '../validator/order.validator';
import CustomErrorHandler from '../services/customErrorHandler';
import { RedisManager } from '../services/redisManager';
import { fnTypes } from '../utils/fnTypes';
import { generateClientOrderId } from '../services/generateOrderId';
const orderController = {
    async createOrder(req: any, res: Response, next: NextFunction) {
        try {
            const { error } = createOrderSchema.validate(req.body);
            if (error) {
                next(CustomErrorHandler.invalidCredentials(error.details[0].message))
            }
            const userId = req.user.id;
            const { market, side, type, price, quantity, timeInForce
            } = req.body;
            console.log(userId)
            const response = await RedisManager.getInstance().sendAndAwait({
                type: fnTypes.CREATE_ORDER,
                data: {
                    market,
                    side,
                    clientOrderId: generateClientOrderId(),
                    type,
                    price,
                    quantity,
                    timeInForce,
                    userId,
                    timeStamp: Date.now()
                }
            });
            res.status(200).json({
                success: true,
                message: "Order created successfully",
                data: JSON.parse(response as string)
            })
        } catch (error) {
            next(error)
        }
    },
    async getOpenOrders(req: any, res: Response, next: NextFunction) {
        try {
            const userId = req.user.id;
            const market = req.query.market;
            if (!market) {
                next(CustomErrorHandler.invalidCredentials("market is required"))
            }
            const response = await RedisManager.getInstance().sendAndAwait({
                type: fnTypes.GET_OPEN_ORDERS,
                data: {
                    market,
                    userId
                }
            });
            res.status(200).json({
                success: true,
                message: "Orders retrieved successfully",
                data: JSON.parse(response as string)
            })
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    async getDepth(req: any, res: Response, next: NextFunction) {
        try {
            const market = req.query.market;
            if (!market) {
                next(CustomErrorHandler.invalidCredentials("market is required"))
            }
            const response = await RedisManager.getInstance().sendAndAwait({
                type: fnTypes.GET_DEPTH,
                data: {
                    market
                }
            })
            const data = JSON.parse(response as string);

            res.status(200).json({
                success: true,
                message: "Depth retrieved successfully",
                data: data?.payload
            })
        } catch (error) {
            console.log(error);
            next(error)
        }
    },

    //we can allow quantity to how many orders should be cancel. And also price so that up of the price orders can be cancel.
    async cancelOrder(req: any, res: Response, next: NextFunction) {
        try {
            const { error } = cancelOrderSchema.validate(req.body);
            if (error) {
                next(error)
            }
            const { market, orderId, side } = req.body;
            const response = await RedisManager.getInstance().sendAndAwait({
                type: fnTypes.CANCEL_ORDER,
                data: {
                    market,
                    orderId,
                    side
                }
            });
            res.status(200).json({
                success: true,
                message: "Order cancelled successfully",
                data: JSON.parse(response as string)
            });
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}

export default orderController;