// src/infrastructure/database/models/subscriptionModel.ts
import mongoose, { Schema } from "mongoose";
import { SubscriptionEntity } from "../../../domain/entities/subscriptionEntity";
import { SubscriptionStatus } from "../../../shared/constants/payment-status.enums";

const subscriptionSchema = new Schema<SubscriptionEntity>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: [true, "User reference is required"],
      index: true,
    },
    plan: {
      type: Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
      required: [true, "Plan reference is required"],
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      required: [true, "Payment reference is required"],
    },
    status: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      default: SubscriptionStatus.ACTIVE,
      index: true,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
      index: true, // Crucial for cron jobs checking expired subscriptions
    },

  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  }
);

const SubscriptionModel =
  mongoose.models.Subscription ||
  mongoose.model<SubscriptionEntity>("Subscription", subscriptionSchema);

export default SubscriptionModel;