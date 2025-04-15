import express from "express";
import registerController from "../controller/register.controller";
import loginController from "../controller/login.controller";

const router = express.Router();

router.post("/register", registerController.register);
router.post("/login", loginController.login);

export default router;