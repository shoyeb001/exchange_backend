import { NextFunction, Response } from "express";
import Joi, { date } from "joi";
import { RedisManager } from "../services/redisManager";

const fundController = {
    async addFunds(req: any, res: Response, next: NextFunction) {
        try {
            const fundSchema = Joi.object({
                amount: Joi.number().required(),
            });
            const { error } = fundSchema.validate(req.body);
            if (error) {
                next(error)
            }
            const userId = req.user.id;
            const amount = req.body.amount;
            const response = await RedisManager.getInstance().sendAndAwait({
                type: "ON_RAMP",
                data: {
                    userId,
                    amount
                }
            })
            res.status(200).json({
                success: true,
                message: "Funds added successfully",
                data: JSON.parse(response as string)
            })
        } catch (error) {
            next(error)
        }
    }
}
export default fundController;