import { check } from "express-validator";
import validatorMiddleware from "../middlewares/validatorMiddleWare";
import { throwError } from "../../shared/utils/helpers";
import PaymentModel from "../../infrastructure/database/models/paymentModel";
import { printBlue } from "../../shared/utils/printColors";
import PaymentOptionModel from "../../infrastructure/database/models/paymentOptionModel";
import { PaymentStatusValues } from "../../shared/constants/payment-status.enums";
const createPaymentValidator = [

    check("walletNumber")
        .notEmpty()
        .withMessage("Wallet number is required")
        .isString().withMessage("Wallet number must be a string")
        .isLength({ min: 11, max: 11 }).withMessage("Wallet number must be between 10 and 20 characters")
        .trim().custom(async (walletNumber, { req }) => {
            const isWalletExisted = await PaymentOptionModel.exists({ phone: walletNumber, paymentType: req.body.walletType, active: { $ne: false } });
            if (!isWalletExisted) {
                return throwError(400, "wallet number is not exist");
            }
        }),
    check("userWalletNumber")
        .notEmpty()
        .withMessage("Wallet number is required")
        .isString().withMessage("Wallet number must be a string")
        .isLength({ min: 11, max: 11 }).withMessage("Wallet number must be between 10 and 20 characters"),

    check("amount")
        .notEmpty()
        .withMessage("Amount is required")
        .trim()
        .isFloat({ gt: 0 })
        .withMessage("Amount must be a decimal/float number")
        .custom((value) => {
            if (parseFloat(value) <= 0) {
                return throwError(400, "Amount must be greater than zero");
            }
            return true;
        }),

    check("receiptImageUrl")
        .trim()
        .notEmpty()
        .withMessage("Wallet number is required")
        .isURL()
        .withMessage("Wallet number must be between 10 and 20 characters"),

    check("currency")
        .notEmpty()
        .withMessage("Currency is required")
        .isString()
        .withMessage("Currency must be a string")
        .trim()
        .toUpperCase()
        .isLength({ min: 3, max: 3 })
        .withMessage("Currency must be 3 characters"),

    check("currencySymbol")
        .notEmpty()
        .withMessage("Currency symbol is required")
        .isString()
        .withMessage("Currency symbol must be a string")
        .trim()
        .isLength({ min: 1, max: 5 })
        .withMessage("Currency symbol must be a string"),

    check("walletType")
        .notEmpty()
        .withMessage("Wallet number is required")
        .isString()
        .withMessage("Wallet number must be a string")
        .trim().isLength({ min: 2, max: 50 })
        .withMessage("Wallet type must be between 2 and 50 characters")
        .custom(async (walletType) => {
            const isWalletExisted = await PaymentOptionModel.exists({ paymentType: walletType, active: { $ne: false } });
            if (!isWalletExisted) {
                return throwError(400, "wallet number is not exist");
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
