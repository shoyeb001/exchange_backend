import { IUserRequest } from "../@types/user.type";
import userSchema from "../models/user.model";
import { registerValidator } from "../validator/register.validator"
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import JWTService from "../services/jwtService";
import CustomErrorHandler from "../services/customErrorHandler";

const registerController = {
    async register(req: Request, res: Response,next:NextFunction) {
        try {
            const { error } = registerValidator.validate(req.body);
            if (error) {
                return next(error);
            } 
            const exist = await userSchema.exists({ email: req.body.email });
            if (exist) {
                return next(CustomErrorHandler.alreadyExist("Email already exists"));
            }
            const { name, email, password }: IUserRequest = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new userSchema({ name, email, password: hashedPassword, role: "user", isActive: true });
            const savedUser = await user.save();
            const accessToken = JWTService.sign({
                id: savedUser._id,
                role: savedUser.role,
            });
            res.status(201).json({
                success:true,
                message: "User registered successfully",
                data: {
                    name: savedUser.name,
                    role: savedUser.role,
                    accessToken
                }
            });

        } catch (error) {
            return next(error);
        }
    }
}

export default registerController;