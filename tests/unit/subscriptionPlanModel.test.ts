import test from "node:test";
import assert from "node:assert/strict";
import SubscriptionPlanModel from "../../src/infrastructure/database/models/subscriptionPlanModel";

test("subscription plan schema validates the required business fields", () => {
    const plan = new SubscriptionPlanModel({
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
    assert.equal(error, undefined);
    assert.equal(plan.title, "Basic");
});

test("subscription plan schema rejects a non-positive price", () => {
    const plan = new SubscriptionPlanModel({
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
    assert.ok(error);
    assert.match(error?.message, /price/i);
});

test("subscription plan schema rejects an invalid billing period", () => {
    const plan = new SubscriptionPlanModel({
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
    assert.ok(error);
    assert.match(error?.message, /billingPeriod/i);
});
