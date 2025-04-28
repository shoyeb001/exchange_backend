import { Request, Response, NextFunction } from "express";
import CustomErrorHandler from "../services/customErrorHandler";
import { config } from "../config";

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    let errorStatus = err.status || 500;
    let errorMessage = err.message || "Internal Server Error";

    if (err instanceof CustomErrorHandler) {
        errorStatus = err.status;
        errorMessage = err.message;
    }

    res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: config.NODE_ENV === "development" ? err.stack : undefined,
    });
}

export default errorHandler;