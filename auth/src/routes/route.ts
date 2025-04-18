import express from "express";
import registerController from "../controller/register.controller";
import loginController from "../controller/login.controller";
import userController from "../controller/user.controller";
import auth from "../middleware/auth";
import user from "../middleware/user";

const router = express.Router();

router.post("/register", registerController.register)
    .post("/login", loginController.login)
    .get("/user/details", [auth, user], userController.getUser);

export default router;