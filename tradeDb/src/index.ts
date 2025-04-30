import { config } from "./config";
import express from "express";
import { startQueueService } from "./services/queueService";
import { Response } from "express";
import tradeController from "./controller/trade.controller";
import tickerController from "./controller/ticker.controller";
export const app = express();
app.use(express.json());
app.get("/trades", tradeController.getTrades);
app.get("/ticker", tickerController.getTicker);
app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`)
});
startQueueService();