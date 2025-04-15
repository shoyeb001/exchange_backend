import { Request, Response, NextFunction } from "express";
import { ILoginRequest } from "../@types/user.type";
import userSchema from "../models/user.model";
import { loginValidator } from "../validator/login.validator";
import CustomErrorHandler from "../services/customErrorHandler";
import JWTService from "../services/jwtService";
import bcrypt from "bcrypt";

const loginController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = loginValidator.validate(req.body);
      if (error) {
        return next(error);
      }

      const { email, password }: ILoginRequest = req.body;
      const user = await userSchema.findOne({ email });
      if (!user) {
        return next(CustomErrorHandler.notFound("User not found"));
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return next(
          CustomErrorHandler.invalidCredentials("Invalid email or password")
        );
      }
      const accessToken = JWTService.sign({
        id: user._id,
        role: user.role,
      });

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          name: user.name,
          role: user.role,
          accessToken,
        },
      });
    } catch (error) {
      return next(error);
    }
  },
};

export default loginController;
