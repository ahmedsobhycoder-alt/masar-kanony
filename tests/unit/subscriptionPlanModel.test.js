"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const subscriptionPlanModel_1 = __importDefault(require("../../src/infrastructure/database/models/subscriptionPlanModel"));
(0, node_test_1.default)("subscription plan schema validates the required business fields", () => {
    const plan = new subscriptionPlanModel_1.default({
        title: "Basic",
        subtitle: "For new users",
        price: 10,
        currency: "USD",
        currencySymbol: "$",
        billingPeriod: "monthly",
        billingLabel: "per month",
        features: ["One court"],
        isPopular: false,
    });
    const error = plan.validateSync();
    strict_1.default.equal(error, undefined);
    strict_1.default.equal(plan.title, "Basic");
});
(0, node_test_1.default)("subscription plan schema rejects a non-positive price", () => {
    const plan = new subscriptionPlanModel_1.default({
        title: "Basic",
        subtitle: "For new users",
        price: 0,
        currency: "USD",
        currencySymbol: "$",
        billingPeriod: "monthly",
        billingLabel: "per month",
        features: ["One court"],
        isPopular: false,
    });
    const error = plan.validateSync();
    strict_1.default.ok(error);
    strict_1.default.match(error?.message, /price/i);
});
(0, node_test_1.default)("subscription plan schema rejects an invalid billing period", () => {
    const plan = new subscriptionPlanModel_1.default({
        title: "Basic",
        subtitle: "For new users",
        price: 10,
        currency: "USD",
        currencySymbol: "$",
        billingPeriod: "annually",
        billingLabel: "per month",
        features: ["One court"],
        isPopular: false,
    });
    const error = plan.validateSync();
    strict_1.default.ok(error);
    strict_1.default.match(error?.message, /billingPeriod/i);
});
