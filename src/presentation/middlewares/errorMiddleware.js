"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalError = void 0;
const apiError_1 = __importDefault(require("../../shared/errors/apiError")); // Adjust this path based on where ApiError lives
/**
 * Global Error Handling Middleware
 */
const globalError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === "production") {
        handleProductionError(err, req, res);
    }
    else {
        handleDevelopmentError(err, req, res);
    }
};
exports.globalError = globalError;
const handleProductionError = (err, req, res) => {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
        err = handleJwtError(err, req);
    }
    if (err.isOperational) {
        err.message = req.t(err.message, { ns: 'errors' });
        return res.status(err.statusCode).json(err.getErrorJson());
    }
    else {
        return res.status(500).json({
            status: false,
            message: req.t('internal_error', { ns: 'errors' }),
        });
    }
};
const handleDevelopmentError = (err, req, res) => {
    if (err.isOperational) {
        err.message = req.t(err.message, { ns: 'errors' });
        return res.status(err.statusCode).json(err.getErrorJson());
    }
    else {
        return res.status(err.statusCode).json({
            status: 'error',
            message: req.t('internal_error', { ns: 'errors' }),
            stack: err.stack,
            error: err,
        });
    }
};
const handleJwtError = (err, req) => {
    if (err.name === "TokenExpiredError") {
        return new apiError_1.default(401, req.t('Your token has expired. Please log in again.', { ns: 'errors' }));
    }
    else if (err.name === "JsonWebTokenError") {
        return new apiError_1.default(401, req.t('Invalid token. Please log in again.', { ns: 'errors' }));
    }
};
