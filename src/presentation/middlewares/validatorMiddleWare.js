"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
// Update the path based on where you saved ApiError
const apiError_1 = __importDefault(require("../../shared/errors/apiError"));
const validatorMiddleware = (req, res, next) => {
    // Gather validation errors from the current request.
    const errors = (0, express_validator_1.validationResult)(req);
    // If there are validation errors, respond with the first localized error message and a 400 status.
    if (!errors.isEmpty()) {
        const rawMessage = String(errors.array()[0].msg);
        const errorMessage = req.t(rawMessage, { ns: 'errors' });
        const apiError = new apiError_1.default(400, errorMessage);
        res.status(400).json(apiError.getErrorJson());
        return;
    }
    // If validation passed, continue to the next middleware or route handler.
    next();
};
exports.default = validatorMiddleware;
