import express, { Response } from 'express';
import { config } from "./config";
import errorHandler from './middleware/errorHandler';
import router from './routes/route';
export const app = express();
app.use(express.json());
app.get("/", (req, res: Response) => {
    const health = {
        uptime: process.uptime(),
        responsetime: process.hrtime(),
        status: "All good",
        timestamp: Date.now(),
    };
    res.status(200).json(
        {
            message: "Welcome to Clothify REAST API Server",
            success: true,
            lisence: "MIT",
            health
        })
});
app.use('/api', router);
app.use(errorHandler);
app.listen(config.PORT, async () => {
    console.log(`Server is running on port ${config.PORT}`);
})