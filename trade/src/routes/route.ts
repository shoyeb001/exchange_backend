import express from 'express';
import orderController from '../controller/order.controller';
import auth from '../middleware/auth';
import user from '../middleware/user';
import fundController from '../controller/fund.controller';
import tradeController from '../controller/trade.controller';
import tickerController from '../controller/ticker.controller';
const router = express.Router();

router.post("/order/create", [auth, user], orderController.createOrder)
    .post("/fund/add", [auth, user], fundController.addFunds)
    .get("/trades", tradeController.getTrade)
    .get("/order/open", [auth, user], orderController.getOpenOrders)
    .get("/order/depth", orderController.getDepth)
    .post("/order/cancel", [auth, user], orderController.cancelOrder)
    .get("/ticker", tickerController.getTicker);
export default router;