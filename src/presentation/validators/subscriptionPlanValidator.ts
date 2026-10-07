import { check } from "express-validator";
import validatorMiddleware from "../middlewares/validatorMiddleWare";
import SubscriptionPlanModel from "../../infrastructure/database/models/subscriptionPlanModel";
import ApiError from "../../shared/errors/apiError";

const billingPeriods = ["monthly", "quarterly", "yearly"];

const featureArrayValidator = check("features")
    .isArray({ min: 1 })
    .withMessage("At least one feature is required")
    .custom((features) => {
        if (!features.every((feature: unknown) => typeof feature === "string" && feature.trim().length > 0)) {
            throw new ApiError(400, "Each feature must be a non-empty string");
        }
        return true;
    });

export const getSubscriptionPlanByIdValidator = [
    check("id").isMongoId().withMessage("Invalid subscription plan id"),
    validatorMiddleware,
];

export const createSubscriptionPlanValidator = [
    check("title")
        .isString().withMessage("Title must be a string")
        .notEmpty().withMessage("Title is required")
        .trim()
        .custom(async (title) => {
            if (await SubscriptionPlanModel.exists({ title })) {
                throw new ApiError(400, "Subscription plan title already exists");
            }
            return true;
        }),
    check("subtitle").isString().withMessage("Subtitle must be a string").notEmpty().withMessage("Subtitle is required").trim(),
    check("price").isFloat({ min: 0.01 }).withMessage("Price must be greater than zero"),
    check("currency").isString().withMessage("Currency must be a string").notEmpty().withMessage("Currency is required").trim().isLength({ min: 3, max: 3 }).withMessage("Currency must be 3 characters").toUpperCase(),
    check("currencySymbol").isString().withMessage("Currency symbol must be a string").notEmpty().withMessage("Currency symbol is required").trim(),
    check("billingPeriod").isIn(billingPeriods).withMessage("Billing period must be monthly, quarterly, or yearly").trim(),
    check("billingLabel").isString().withMessage("Billing label must be a string").notEmpty().withMessage("Billing label is required").trim(),
    featureArrayValidator,
    check("isPopular").isBoolean().withMessage("isPopular must be a boolean"),
    validatorMiddleware,
];

export const updateSubscriptionPlanValidator = [
    check("id").optional().isMongoId().withMessage("Invalid subscription plan id"),
    check("title")
        .optional()
        .isString().withMessage("Title must be a string")
        .notEmpty().withMessage("Title is required")
        .trim()
        .custom(async (title, { req }) => {
            const id = req.params?.id;
            if (!id) {
                return true;
            }

            const existingPlan = await SubscriptionPlanModel.findOne({ title });
            if (existingPlan && existingPlan._id.toString() !== String(id)) {
                throw new ApiError(400, "Subscription plan title already exists");
            }
            return true;
        }),
    check("subtitle").optional().isString().withMessage("Subtitle must be a string").notEmpty().withMessage("Subtitle is required").trim(),
    check("price").optional().isFloat({ min: 0.01 }).withMessage("Price must be greater than zero"),
    check("currency").optional().isString().withMessage("Currency must be a string").notEmpty().withMessage("Currency is required").trim().isLength({ min: 3, max: 3 }).withMessage("Currency must be 3 characters").toUpperCase(),
    check("currencySymbol").optional().isString().withMessage("Currency symbol must be a string").notEmpty().withMessage("Currency symbol is required").trim(),
    check("billingPeriod").optional().isIn(billingPeriods).withMessage("Billing period must be monthly, quarterly, or yearly").trim(),
    check("billingLabel").optional().isString().withMessage("Billing label must be a string").notEmpty().withMessage("Billing label is required").trim(),
    featureArrayValidator.optional(),
    check("isPopular").optional().isBoolean().withMessage("isPopular must be a boolean"),
    validatorMiddleware,
];
