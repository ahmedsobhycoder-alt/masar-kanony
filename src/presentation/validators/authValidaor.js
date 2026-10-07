"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordValidator = exports.verifyResetCodeValidator = exports.forgetPasswordValidator = exports.loginValidator = exports.verifyValidator = exports.signUpValidator = void 0;
const userModel_1 = __importDefault(require("../../infrastructure/database/models/userModel"));
const express_validator_1 = require("express-validator");
const validatorMiddleWare_1 = __importDefault(require("../middlewares/validatorMiddleWare"));
const apiError_1 = __importDefault(require("../../shared/errors/apiError"));
exports.signUpValidator = [
    (0, express_validator_1.check)("name").notEmpty().withMessage("User name is required").trim(),
    (0, express_validator_1.check)("email").isEmail().withMessage("User email is required").trim().custom(async (email) => {
        const isEmailExisted = await userModel_1.default.exists({ email });
        if (isEmailExisted) {
            throw new apiError_1.default(400, "Email already exists");
        }
    }),
    (0, express_validator_1.check)("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters").trim(),
    (0, express_validator_1.check)("phone").isLength({ min: 11 }).withMessage("Phone number must be 11 digits").trim().custom(async (phone) => {
        const isPhoneExisted = await userModel_1.default.exists({ phone });
        if (isPhoneExisted) {
            throw new apiError_1.default(400, "Phone number already exists");
        }
    }),
    validatorMiddleWare_1.default,
];
exports.verifyValidator = [
    (0, express_validator_1.check)("email").isEmail().withMessage("User email is required").trim(),
    (0, express_validator_1.check)("otp").isLength({ min: 4 }).withMessage("OTP must be 4 digits").trim(),
    validatorMiddleWare_1.default
];
exports.loginValidator = [
    (0, express_validator_1.check)("email").isEmail().withMessage("User email is required").trim(),
    (0, express_validator_1.check)("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters").trim(),
    validatorMiddleWare_1.default
];
exports.forgetPasswordValidator = [
    (0, express_validator_1.check)("email").isEmail().withMessage("User email is required").trim().custom(async (email) => {
        const userExists = await userModel_1.default.exists({ email });
        if (!userExists) {
            throw new apiError_1.default(400, "User not found");
        }
    }),
    validatorMiddleWare_1.default,
];
exports.verifyResetCodeValidator = [
    (0, express_validator_1.check)("email").isEmail().withMessage("User email is required").trim(),
    (0, express_validator_1.check)("resetCode").isLength({ min: 4, max: 4 }).withMessage("Reset code must be 4 digits").trim(),
    validatorMiddleWare_1.default,
];
exports.resetPasswordValidator = [
    (0, express_validator_1.check)("email").isEmail().withMessage("User email is required").trim(),
    (0, express_validator_1.check)("newPassword").isString().withMessage("password must be a string").isLength({ min: 6 }).withMessage("Password must be at least 6 characters").trim(),
    validatorMiddleWare_1.default,
];
