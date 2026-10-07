"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentsValidator = exports.getPaymentByIdValidator = exports.updatePaymentStatusValidator = exports.createPaymentValidator = void 0;
const express_validator_1 = require("express-validator");
const validatorMiddleWare_1 = __importDefault(require("../middlewares/validatorMiddleWare"));
const apiError_1 = __importDefault(require("../../shared/errors/apiError"));
const paymentModel_1 = __importDefault(require("../../infrastructure/database/models/paymentModel"));
const paymentOptionModel_1 = __importDefault(require("../../infrastructure/database/models/paymentOptionModel"));
const payment_status_enums_1 = require("../../shared/constants/payment-status.enums");
const createPaymentValidator = [
    (0, express_validator_1.check)("walletNumber")
        .notEmpty()
        .withMessage("Wallet number is required")
        .isString().withMessage("Wallet number must be a string")
        .isLength({ min: 10, max: 20 }).withMessage("Wallet number must be between 10 and 20 characters")
        .trim().custom(async (walletNumber) => {
        const isWalletExisted = await paymentOptionModel_1.default.exists({ phone: walletNumber });
        if (!isWalletExisted) {
            throw new apiError_1.default(400, "wallet number is not exist");
        }
    }),
    (0, express_validator_1.check)("amount")
        .notEmpty()
        .withMessage("Amount is required")
        .trim()
        .matches(/^\d+\.\d+$/)
        .withMessage("Amount must be a decimal/float number")
        .custom((value) => {
        if (parseFloat(value) <= 0) {
            throw new apiError_1.default(400, "Amount must be greater than zero");
        }
        return true;
    }),
    (0, express_validator_1.check)("transactionId")
        .notEmpty()
        .withMessage("Transaction ID is required")
        .trim()
        .custom(async (transactionId) => {
        const isTransactionExisted = await paymentModel_1.default.exists({ transactionId });
        if (isTransactionExisted) {
            throw new apiError_1.default(400, "Transaction ID already exists");
        }
    }),
    validatorMiddleWare_1.default,
];
exports.createPaymentValidator = createPaymentValidator;
const getPaymentsValidator = [
    (0, express_validator_1.check)("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer"),
    (0, express_validator_1.check)("limit")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Limit must be a positive integer"),
    (0, express_validator_1.check)("status")
        .optional()
        .isIn(payment_status_enums_1.PaymentStatusValues)
        .withMessage("Invalid payment status"),
    validatorMiddleWare_1.default,
];
exports.getPaymentsValidator = getPaymentsValidator;
const updatePaymentStatusValidator = [
    (0, express_validator_1.check)("id")
        .isMongoId()
        .withMessage("Invalid payment ID format"),
    (0, express_validator_1.check)("status")
        .notEmpty()
        .withMessage("Status is required")
        .trim()
        .isIn(payment_status_enums_1.PaymentStatusValues)
        .withMessage("Invalid payment status"),
    validatorMiddleWare_1.default,
];
exports.updatePaymentStatusValidator = updatePaymentStatusValidator;
const getPaymentByIdValidator = [
    (0, express_validator_1.check)("id")
        .isMongoId()
        .withMessage("Invalid payment ID format"),
    validatorMiddleWare_1.default,
];
exports.getPaymentByIdValidator = getPaymentByIdValidator;
