import { Request, Response, NextFunction } from "express";
import  ApiError  from "../../shared/errors/apiError"; // Adjust this path based on where ApiError lives

/**
 * Global Error Handling Middleware
 */
const translate = (req: Request, key: string, options?: Record<string, any>) => {
    if (typeof req?.t === 'function') {
        return req.t(key, { ...(options || {}), ns: options?.ns ?? 'errors' });
    }

    return key;
};

export const globalError = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === "production") {
        handleProductionError(err, req, res);
    } else {
        handleDevelopmentError(err, req, res);
    }
};

const handleProductionError = (err: any, req: Request, res: Response) => {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
        err = handleJwtError(err, req);
    }

    if (err.isOperational) {
        err.message = translate(req, err.message, { ns: 'errors' });
        return res.status(err.statusCode).json(err.getErrorJson());
    } else {
        return res.status(500).json({
            status: false,
            message: translate(req, 'internal_error', { ns: 'errors' }),
        });
    }
};

const handleDevelopmentError = (err: any, req: Request, res: Response) => {
    if (err.isOperational) {
        err.message = translate(req, err.message, { ns: 'errors' });
        return res.status(err.statusCode).json(err.getErrorJson());
    } else {
        return res.status(err.statusCode).json({
            status: 'error',
            message: translate(req, 'internal_error', { ns: 'errors' }),
            stack: err.stack,
            error: err,
        });
    }
};

const handleJwtError = (err: any, req: Request) => {
    if (err.name === "TokenExpiredError") {
        return new ApiError(401, translate(req, 'Your token has expired. Please log in again.', { ns: 'errors' }));
    } else if (err.name === "JsonWebTokenError") {
        return new ApiError(401, translate(req, 'Invalid token. Please log in again.', { ns: 'errors' }));
    }
};