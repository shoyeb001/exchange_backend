import { IUserRequest } from "../@types/user.type";
import userSchema from "../models/user.model";
import { registerValidator } from "../validator/register.validator"
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import JWTService from "../services/jwtService";
import { date } from "joi";
const registerController = {
    async register(req: Request, res: Response) {
        try {
            const { error } = registerValidator.validate(req.body);
            if (error) {
                res.status(403).json({ error: error.details[0].message });
            }
            const exist = await userSchema.exists({ email: req.body.email });
            if (exist) {
                res.status(400).json({ error: "Email already exists" });
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
                status: "success",
                message: "User registered successfully",
                data: {
                    name: savedUser.name,
                    role: savedUser.role,
                    accessToken
                }
            });

        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
                error: error
            })
        }
    }
}

export default registerController;