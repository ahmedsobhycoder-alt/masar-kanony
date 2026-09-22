import { Request, Response, NextFunction } from "express";
import  ApiError  from "../../shared/errors/apiError"; // Adjust this path based on where ApiError lives

/**
 * Global Error Handling Middleware
 */
export const globalError = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === "production") {
        handleProductionError(err, res);
    } else {
        handleDevelopmentError(err, res);
    }
};

const handleProductionError = (err: any, res: Response) => {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
        err = handleJwtError(err);
    }

    if (err.isOperational) {
        return res.status(err.statusCode).json(err.getErrorJson());
    } else {
        return res.status(500).json({
            status: false,
            message: `Something went wrong: ${err.message}`,
        });
    }
};

const handleDevelopmentError = (err: any, res: Response) => {
    if (err.isOperational) {
        return res.status(err.statusCode).json(err.getErrorJson());
    } else {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
            stack: err.stack,
            error: err,
        });
    }
};

const handleJwtError = (err: any) => {
    if (err.name === "TokenExpiredError") {
        return new ApiError(401, "Your token has expired. Please log in again.");
    } else if (err.name === "JsonWebTokenError") {
        return new ApiError(401, "Invalid token. Please log in again.");
    }
};