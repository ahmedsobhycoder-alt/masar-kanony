import mongoose, { Schema } from "mongoose";
import SubscriptionPlanEntity from "../../../domain/entities/subscriptionPlanEntity";

const subscriptionPlanSchema = new Schema<SubscriptionPlanEntity>(
    {
        title: {
            type: String,
            required: [true, "Subscription plan title is required"],
            trim: true,
            unique: [true, "Subscription plan title must be unique"],
        },
        subtitle: {
            type: String,
            required: [true, "Subscription plan subtitle is required"],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, "Subscription plan price is required"],
            min: [0.01, "Subscription plan price must be greater than zero"],
        },
        currency: {
            type: String,
            required: [true, "Subscription plan currency is required"],
            trim: true,
            uppercase: true,
            minlength: [3, "Currency must be 3 characters"],
            maxlength: [3, "Currency must be 3 characters"],
        },
        currencySymbol: {
            type: String,
            required: [true, "Currency symbol is required"],
            trim: true,
        },
        billingPeriod: {
            type: String,
            required: [true, "Billing period is required"],
            trim: true,
            enum: {
                values: ["monthly", "quarterly", "yearly"],
                message: "Billing period must be monthly, quarterly, or yearly",
            },
        },
        billingLabel: {
            type: String,
            required: [true, "Billing label is required"],
            trim: true,
        },
        features: {
            type: [String],
            required: [true, "Subscription plan features are required"],
            validate: {
                validator: (features: string[]) => Array.isArray(features) && features.length > 0,
                message: "At least one feature is required",
            },
        },
        isPopular: {
            type: Boolean,
            required: [true, "isPopular is required"],
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_, ret: Record<string, any>) => {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
        toObject: {
            transform: (_, ret: Record<string, any>) => {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

const SubscriptionPlanModel = mongoose.model<SubscriptionPlanEntity>(
    "SubscriptionPlans",
    subscriptionPlanSchema
);

export default SubscriptionPlanModel;
