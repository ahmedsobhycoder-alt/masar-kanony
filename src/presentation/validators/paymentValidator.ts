import { check } from "express-validator";
import validatorMiddleware from "../middlewares/validatorMiddleWare";
import ApiError from "../../shared/errors/apiError";
import PaymentModel from "../../infrastructure/database/models/paymentModel";
import { printBlue } from "../../shared/utils/printColors";
import PaymentOptionModel from "../../infrastructure/database/models/paymentOptionModel";
import { PaymentStatusValues } from "../../shared/constants/payment-status.enums";
const createPaymentValidator = [


    check("walletNumber")
        .notEmpty()
        .withMessage("Wallet number is required")
        .isString().withMessage("Wallet number must be a string")
        .isLength({ min: 10, max: 20 }).withMessage("Wallet number must be between 10 and 20 characters")
        .trim().custom(async (walletNumber) => {
            const isWalletExisted = await PaymentOptionModel.exists({ phone: walletNumber });
            if (!isWalletExisted) {
                throw new ApiError(400, "wallet number is not exist");
            }
        }),


    check("amount")
        .notEmpty()
        .withMessage("Amount is required")
        .trim()
        .matches(/^\d+\.\d+$/)
        .withMessage("Amount must be a decimal/float number")
        .custom((value) => {
            if (parseFloat(value) <= 0) {
                throw new ApiError(400, "Amount must be greater than zero");
            }
            return true;
        }),
    check("transactionId")
        .notEmpty()
        .withMessage("Transaction ID is required")
        .trim()
        .custom(async (transactionId) => {
            const isTransactionExisted = await PaymentModel.exists({ transactionId });
            if (isTransactionExisted) {
                throw new ApiError(400, "Transaction ID already exists");
            }
        }),



    validatorMiddleware,
];
const getPaymentsValidator = [
    check("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer"),

    check("limit")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Limit must be a positive integer"),
    check("status")
        .optional()
        .isIn(PaymentStatusValues)
        .withMessage("Invalid payment status"),
    validatorMiddleware,
];
const updatePaymentStatusValidator = [
    check("id")
        .isMongoId()
        .withMessage("Invalid payment ID format"),

    check("status")
        .notEmpty()
        .withMessage("Status is required")
        .trim()
        .isIn(PaymentStatusValues)
        .withMessage("Invalid payment status"),

    validatorMiddleware,
];

const getPaymentByIdValidator = [
    check("id")
        .isMongoId()
        .withMessage("Invalid payment ID format"),

    validatorMiddleware,
];

export {
    createPaymentValidator,
    updatePaymentStatusValidator,
    getPaymentByIdValidator,
    getPaymentsValidator
};