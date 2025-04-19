import { Response, NextFunction } from 'express';
import { createOrderSchema } from '../validator/order.validator';
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
                data: response
            })
        } catch (error) {
            next(error)
        }
    }
}

export default orderController;