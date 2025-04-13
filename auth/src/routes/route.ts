import express from "express";
import registerController from "../controller/register.controller";

const router = express.Router();

router.post("/register", registerController.register);