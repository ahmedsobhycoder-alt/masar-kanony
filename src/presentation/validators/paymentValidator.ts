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
        .isLength({ min: 11, max: 11 }).withMessage("Wallet number must be 11 digits characters")
        .trim().custom(async (walletNumber) => {
            const isWalletExisted = await PaymentOptionModel.exists({ phone: walletNumber });
            if (!isWalletExisted) {
                throw new ApiError(400, "wallet number is not exist");
            }
        }),
        check("userWalletNumber") .notEmpty()
        .withMessage("Wallet number is required")
        .isString().withMessage("your Wallet number must be a string")
        .isLength({ min: 11, max: 11 }).withMessage("your Wallet number must be 11 digits"),


    check("amount")
        .notEmpty()
        .withMessage("Amount is required")
        .trim()
        .isFloat({ gt: 0 })
        .withMessage("Amount must be a decimal/float number")
        .custom((value) => {
            if (parseFloat(value) <= 0) {
                throw new ApiError(400, "Amount must be greater than zero");
            }
            return true;
        }),

    check("receiptImageUrl")
        .trim()
        .notEmpty()
        .withMessage("Payment receipt image is required")
        .isURL()
        .withMessage("Receipt image must be a valid URL"),



    // --- Currency Validation ---
    check("currency")
        .notEmpty()
        .withMessage("Currency is required")
        .isString()
        .withMessage("Currency must be a string")
        .trim()
        .toUpperCase()
        .isLength({ min: 3, max: 3 })
        .withMessage("Currency must be exactly 3 characters (e.g., EGP, USD)"),

    // --- Currency Symbol Validation ---
    check("currencySymbol")
        .notEmpty()
        .withMessage("Currency symbol is required")
        .isString()
        .withMessage("Currency symbol must be a string")
        .trim()
        .isLength({ min: 1, max: 5 })
        .withMessage("Currency symbol must be between 1 and 5 characters"),

    check("walletType")
        .notEmpty()
        .withMessage("Wallet Type is required")
        .isString()
        .withMessage("Wallet Type must be a string")
        .trim().isLength({ min: 2, max: 10 })
        .withMessage("Wallet Type must be between 2 and 10 characters")
        .custom(async (walletType) => {
            const isWalletExisted = await PaymentOptionModel.exists({ paymentType: walletType });
            if (!isWalletExisted) {
                throw new ApiError(400, "wallet number is not exist");
            }
        })
    ,
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