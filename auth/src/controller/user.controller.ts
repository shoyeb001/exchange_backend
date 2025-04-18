import { NextFunction, Response } from "express";
import userModel from "../models/user.model";

const userController = {
    async getUser(req: any, res: Response, next: NextFunction) {
        try {
            const userId = req.user.id;
            const user = await userModel.findById(userId).select("-password -__v").lean().exec();
            res.status(200).json({
                success: true,
                message: "User fetched successfully",
                data: user
            });
        } catch (error) {
            next(error);
        }
    }
}
export default userController;