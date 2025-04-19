import express from 'express';
import orderController from '../controller/order.controller';
import auth from '../middleware/auth';
import user from '../middleware/user';
const router = express.Router();

router.post("/order/create", [auth, user], orderController.createOrder);

export default router;