import {check} from "express-validator";
import validatorMiddleware from "../middlewares/validatorMiddleWare";
import  ApiError  from "../../shared/errors/apiError";
import PaymentOptionModel from "../../infrastructure/database/models/paymentOptionModel";
const createPaymentOptionValidator = [
    check("phone")
        .isLength({ min: 11, max: 11 })
        .withMessage("Phone number must be 11 digits")
        .trim()
        .custom(async (phone) => {
            const isPhoneExisted = await PaymentOptionModel.exists({ phone });
            if (isPhoneExisted) {
                throw new ApiError(400, "Phone number already exists");
            }
        }),
    check("paymentType")
        .notEmpty()
        .withMessage("Payment type is required")
        .trim()
        .custom(async (paymentType) => {
            const isPaymentTypeExisted = await PaymentOptionModel.exists({ paymentType });
            if (isPaymentTypeExisted) {
                throw new ApiError(400, "Payment type already exists");
            }
        }),
    validatorMiddleware,
];

export {createPaymentOptionValidator};