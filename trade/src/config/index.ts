import dotenv from "dotenv";
dotenv.config();

export const config = {
    PORT: process.env.PORT || 3002,
    JWT_SECRET: process.env.JWT_SECRET || "",
    NODE_ENV: process.env.JWT_SECRET || "production",
}