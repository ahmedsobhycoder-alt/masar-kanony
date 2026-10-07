"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentOptionValidator = void 0;
const express_validator_1 = require("express-validator");
const validatorMiddleWare_1 = __importDefault(require("../middlewares/validatorMiddleWare"));
const apiError_1 = __importDefault(require("../../shared/errors/apiError"));
const paymentOptionModel_1 = __importDefault(require("../../infrastructure/database/models/paymentOptionModel"));
const createPaymentOptionValidator = [
    (0, express_validator_1.check)("phone").isLength({ min: 11, max: 11 }).withMessage("Phone number must be 11 digits").trim().custom(async (phone) => {
        const isPhoneExisted = await paymentOptionModel_1.default.exists({ phone });
        if (isPhoneExisted) {
            throw new apiError_1.default(400, "Phone number already exists");
        }
    }), (0, express_validator_1.check)("paymentType").notEmpty().withMessage("Payment type is required").trim().custom(async (paymentType) => {
        const isPaymentTypeExisted = await paymentOptionModel_1.default.exists({ paymentType });
        if (isPaymentTypeExisted) {
            throw new apiError_1.default(400, "Payment type already exists");
        }
    }),
    validatorMiddleWare_1.default
];
exports.createPaymentOptionValidator = createPaymentOptionValidator;
