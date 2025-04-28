import { config } from "./config";
import express from "express";
import { startQueueService } from "./services/queueService";

export const app = express();
app.use(express.json());

app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`)
});
startQueueService();