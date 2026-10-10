import UserModel from "../../infrastructure/database/models/userModel";
import { check, header } from "express-validator";
import validatorMiddleware from "../middlewares/validatorMiddleWare";
import ApiError from "../../shared/errors/apiError";

import OtpModel from "../../infrastructure/database/models/otpModel";
export const signUpValidator = [
    check("name").notEmpty().withMessage("User name is required").trim(),
    check("email").isEmail().withMessage("User email is required").trim().custom(async (email) => {
        const isEmailExisted = await UserModel.exists({ email });
        if (isEmailExisted) {
            throw new ApiError(400, "Email already exists");
        }
    }),
    check("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters").trim(),
    check("phone").isLength({ min: 11 }).withMessage("Phone number must be 11 digits").trim().custom(async (phone) => {
        const isPhoneExisted = await UserModel.exists({ phone });
        if (isPhoneExisted) {
            throw new ApiError(400, "Phone number already exists");
        }
    }),

    validatorMiddleware,
];
export const verifyValidator = [
    check("email").isEmail().withMessage("User email is required").trim(),
    check("otp").isLength({ min: 4 }).withMessage("OTP must be 4 digits").trim(),

    validatorMiddleware
]
export const loginValidator = [
    check("email").isEmail().withMessage("User email is required").trim(),
    check("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters").trim(),
    validatorMiddleware
]

export const logoutValidator = [
    header("authorization").matches(/^Bearer\s+\S+$/i).withMessage("A bearer token is required"),
    validatorMiddleware,
];

export const forgetPasswordValidator = [
    check("email").isEmail().withMessage("User email is required").trim().custom(async (email) => {
        const userExists = await UserModel.exists({ email });
        if (!userExists) {
            throw new ApiError(400, "User not found");
        }
    }),
    validatorMiddleware,
];

export const verifyResetCodeValidator = [
    check("email").isEmail().withMessage("User email is required").trim(),
    check("resetCode").isLength({ min: 4, max: 4 }).withMessage("Reset code must be 4 digits").trim(),
    validatorMiddleware,
];

export const resetPasswordValidator = [
    check("email").isEmail().withMessage("User email is required").trim(),
    check("newPassword").isString().withMessage("password must be a string").isLength({ min: 6 }).withMessage("Password must be at least 6 characters").trim(),
    validatorMiddleware,
];