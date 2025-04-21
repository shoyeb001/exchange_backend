import express from 'express';
import orderController from '../controller/order.controller';
import auth from '../middleware/auth';
import user from '../middleware/user';
import fundController from '../controller/fund.controller';
const router = express.Router();

router.post("/order/create", [auth, user], orderController.createOrder)
    .post("/fund/add", [auth, user], fundController.addFunds)
export default router;