"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAppConfigValidator = exports.createAppConfigValidator = void 0;
const express_validator_1 = require("express-validator");
const validatorMiddleWare_1 = __importDefault(require("../middlewares/validatorMiddleWare"));
exports.createAppConfigValidator = [
    (0, express_validator_1.check)("appName")
        .trim()
        .notEmpty()
        .withMessage("App name is required"),
    (0, express_validator_1.check)("description")
        .trim()
        .notEmpty()
        .withMessage("App description is required"),
    (0, express_validator_1.check)("contactInfo")
        .notEmpty()
        .withMessage("Contact info object is required"),
    (0, express_validator_1.check)("contactInfo.whatsappNumber")
        .trim()
        .notEmpty()
        .withMessage("WhatsApp number is required")
        .matches(/^01[0125][0-9]{8}$/)
        .withMessage("WhatsApp number must be an 11-digit Egyptian phone number"),
    (0, express_validator_1.check)("contactInfo.email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please enter a valid email address")
        .normalizeEmail(),
    (0, express_validator_1.check)("socialMediaLinks.facebook")
        .optional({ checkFalsy: true })
        .isURL()
        .withMessage("Facebook link must be a valid URL"),
    (0, express_validator_1.check)("socialMediaLinks.instagram")
        .optional({ checkFalsy: true })
        .isURL()
        .withMessage("Instagram link must be a valid URL"),
    validatorMiddleWare_1.default,
];
exports.updateAppConfigValidator = [
    (0, express_validator_1.check)("appName")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("App name cannot be empty")
        .isLength({ min: 2, max: 50 })
        .withMessage("App name must be between 2 and 50 characters"),
    (0, express_validator_1.check)("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("App description cannot be empty"),
    (0, express_validator_1.check)("contactInfo")
        .optional()
        .isObject()
        .withMessage("Contact info must be a valid object"),
    (0, express_validator_1.check)("contactInfo.whatsappNumber")
        .optional()
        .trim()
        .matches(/^01[0125][0-9]{8}$/)
        .withMessage("WhatsApp number must be an 11-digit Egyptian phone number"),
    (0, express_validator_1.check)("contactInfo.email")
        .optional()
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email address")
        .normalizeEmail(),
    (0, express_validator_1.check)("socialMediaLinks")
        .optional()
        .isObject()
        .withMessage("Social media links must be a valid object"),
    (0, express_validator_1.check)("socialMediaLinks.facebook")
        .optional({ checkFalsy: true })
        .trim()
        .isURL()
        .withMessage("Facebook link must be a valid URL"),
    (0, express_validator_1.check)("socialMediaLinks.instagram")
        .optional({ checkFalsy: true })
        .trim()
        .isURL()
        .withMessage("Instagram link must be a valid URL"),
    validatorMiddleWare_1.default,
];
