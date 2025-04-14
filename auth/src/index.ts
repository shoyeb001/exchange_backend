import express, { Response } from "express";
import { config } from "./config";
import errorHandler from "./middleware/errorHandler";
export const app = express();
app.use(express.json());
// app.use(
//     cors({
//         origin: [`${config.ORIGIN_FRONTEND}`, `${config.ORIGIN_ADMIN}`],
//         credentials: true,
//     })
// )
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
})
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});
app.use(errorHandler);
app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});