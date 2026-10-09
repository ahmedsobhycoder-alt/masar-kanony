import { check } from "express-validator";
import validatorMiddleware from "../middlewares/validatorMiddleWare";
import ApiError from "../../shared/errors/apiError";
import { policyTypeValues } from "../../infrastructure/database/models/appPolicyModel";
import AppPolicyModel from "../../infrastructure/database/models/appPolicyModel";

export const createAppPolicyValidator = [
    check("type")
        .isString().withMessage("App policy type must be a string")
        .notEmpty()
        .withMessage("App policy type is required")
        .trim()
        .isIn(policyTypeValues).withMessage("Invalid app policy type"),

    check("intro")
        .isString().withMessage("App policy intro must be a string")
        .notEmpty()
        .withMessage("App policy intro is required")
        .trim(),

    check("sections")
        .isArray({ min: 1 })
        .withMessage("App policy sections must be an array with at least one section").custom((sections) => {
            const orders = sections.map((section: any) => section.order);
            const uniqueOrders = new Set(orders);
            if (orders.length !== uniqueOrders.size) {
                throw new ApiError(400, "Section orders must be unique");
            }
            return true;
        }),
    check("sections.*.order")
        .isInt({ min: 1 })
        .withMessage("Section order must be a positive integer"),
    check("sections.*.sectionTitle")
        .isString().withMessage("Section title must be a string").notEmpty().withMessage("Section title is required").trim(),
    check("sections.*.sectionContent")
        .isString().withMessage("Section content must be a string").notEmpty().withMessage("Section content is required").trim(),
    validatorMiddleware,
];
export const updateAppPolicyValidator = [
    check("type")
        .isString().withMessage("App policy type must be a string")
        .notEmpty()
        .withMessage("App policy type is required")
        .trim()
        .isIn(policyTypeValues).withMessage("Invalid app policy type")
        .custom(async (type, { req }) => {
            const appPolicy = await AppPolicyModel.findOne({ type });
            if (!appPolicy) {
                throw new ApiError(400, "App policy type not found");
            }
            return true;
        }),

    check("intro")
        .optional()
        .isString().withMessage("App policy intro must be a string")
        .notEmpty()
        .withMessage("App policy intro is required")
        .trim(),
    check("sections")
        .optional()
        .isArray({ min: 1 })
        .withMessage("App policy sections must be an array with at least one section").custom((sections) => {
            const orders = sections.map((section: any) => section.order);
            const uniqueOrders = new Set(orders);
            if (orders.length !== uniqueOrders.size) {
                throw new ApiError(400, "Section orders must be unique");
            }
            return true;
        }),
    check("sections.*.order")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Section order must be a positive integer"),
    check("sections.*.sectionTitle")
        .optional()
        .isString().withMessage("Section title must be a string").notEmpty().withMessage("Section title is required").trim(),
    check("sections.*.sectionContent")
        .optional()
        .isString().withMessage("Section content must be a string").notEmpty().withMessage("Section content is required").trim(),
    validatorMiddleware,


]