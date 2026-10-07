"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAppPolicyValidator = exports.createAppPolicyValidator = void 0;
const express_validator_1 = require("express-validator");
const validatorMiddleWare_1 = __importDefault(require("../middlewares/validatorMiddleWare"));
const apiError_1 = __importDefault(require("../../shared/errors/apiError"));
const appPolicyModel_1 = require("../../infrastructure/database/models/appPolicyModel");
const appPolicyModel_2 = __importDefault(require("../../infrastructure/database/models/appPolicyModel"));
exports.createAppPolicyValidator = [
    (0, express_validator_1.check)("type")
        .isString().withMessage("App policy type must be a string")
        .notEmpty()
        .withMessage("App policy type is required")
        .trim()
        .isIn(appPolicyModel_1.policyTypeValues).withMessage("Invalid app policy type"),
    (0, express_validator_1.check)("intro")
        .isString().withMessage("App policy intro must be a string")
        .notEmpty()
        .withMessage("App policy intro is required")
        .trim(),
    (0, express_validator_1.check)("sections")
        .isArray({ min: 1 })
        .withMessage("App policy sections must be an array with at least one section").custom((sections) => {
        const orders = sections.map((section) => section.order);
        const uniqueOrders = new Set(orders);
        if (orders.length !== uniqueOrders.size) {
            throw new apiError_1.default(400, "Section orders must be unique");
        }
        return true;
    }),
    (0, express_validator_1.check)("sections.*.order")
        .isInt({ min: 1 })
        .withMessage("Section order must be a positive integer"),
    (0, express_validator_1.check)("sections.*.sectionTitle")
        .isString().withMessage("Section title must be a string").notEmpty().withMessage("Section title is required").trim(),
    (0, express_validator_1.check)("sections.*.sectionContent")
        .isString().withMessage("Section content must be a string").notEmpty().withMessage("Section content is required").trim(),
    validatorMiddleWare_1.default,
];
exports.updateAppPolicyValidator = [
    (0, express_validator_1.check)("type")
        .isString().withMessage("App policy type must be a string")
        .notEmpty()
        .withMessage("App policy type is required")
        .trim()
        .isIn(appPolicyModel_1.policyTypeValues).withMessage("Invalid app policy type")
        .custom(async (type, { req }) => {
        const appPolicy = await appPolicyModel_2.default.findOne({ type });
        if (!appPolicy) {
            throw new apiError_1.default(400, `${type} not found`);
        }
        return true;
    }),
    (0, express_validator_1.check)("intro")
        .optional()
        .isString().withMessage("App policy intro must be a string")
        .notEmpty()
        .withMessage("App policy intro is required")
        .trim(),
    (0, express_validator_1.check)("sections")
        .optional()
        .isArray({ min: 1 })
        .withMessage("App policy sections must be an array with at least one section").custom((sections) => {
        const orders = sections.map((section) => section.order);
        const uniqueOrders = new Set(orders);
        if (orders.length !== uniqueOrders.size) {
            throw new apiError_1.default(400, "Section orders must be unique");
        }
        return true;
    }),
    (0, express_validator_1.check)("sections.*.order")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Section order must be a positive integer"),
    (0, express_validator_1.check)("sections.*.sectionTitle")
        .optional()
        .isString().withMessage("Section title must be a string").notEmpty().withMessage("Section title is required").trim(),
    (0, express_validator_1.check)("sections.*.sectionContent")
        .optional()
        .isString().withMessage("Section content must be a string").notEmpty().withMessage("Section content is required").trim(),
    validatorMiddleWare_1.default,
];
