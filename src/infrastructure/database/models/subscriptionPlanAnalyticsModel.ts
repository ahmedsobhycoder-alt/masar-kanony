import { model, Schema } from "mongoose";

export const SubscriptionPlanAnalytics = model("SubscriptionPlanAnalytics", new Schema({
    _id: String,
    requests: { type: Number, default: 0 },
    authenticatedRequests: { type: Number, default: 0 },
    guestRequests: { type: Number, default: 0 },
    startedAt: Date,
    lastRequestedAt: Date,
}));

export const SubscriptionPlanViewer = model("SubscriptionPlanViewer", new Schema({
    _id: String,
    firstRequestedAt: Date,
}));
