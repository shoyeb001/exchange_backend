import { NextFunction, Response } from "express";
import { RedisManager } from "../services/redisManager";
import CustomErrorHandler from "../services/customErrorHandler";

const user = async (req: any, res: Response, next: NextFunction) => {
    try {
        const userRes = RedisManager.getInstance().get(req.user.sessionId);
        if (!userRes) {
            return next(CustomErrorHandler.unAuthorized('Session expired. Please login again'));
        }
        next();
    } catch (error) {
        return next(error);
    }
}

export default user;