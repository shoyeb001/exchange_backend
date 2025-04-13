import express, { Response } from "express";
import { config } from "./config";
export const app = express();
app.use(express.json());
// app.use(
//     cors({
//         origin: [`${config.ORIGIN_FRONTEND}`, `${config.ORIGIN_ADMIN}`],
//         credentials: true,
//     })
// )

app.get("/", (req, res: Response) => {
    res.status(200).json({
        message: "Welcome to the auth service",
        status: "success",
    })
})
app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});