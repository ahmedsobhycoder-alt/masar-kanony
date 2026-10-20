import mongoose, { Schema } from "mongoose";
import NotificationEntity from "../../../domain/entities/notificationEntity";

const notificationSchema = new Schema<NotificationEntity>(
  {
    title: {
      type: String,
      required: [true, "Notification title is required"],
      trim: true,
    },
    body: {
      type: String,
      required: [true, "Notification body is required"],
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Notification must belong to a user"],
      index: true,
    },
    type: {
      type: String,
      default: "GENERAL",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

const NotificationModel =
  mongoose.models.Notification ||
  mongoose.model<NotificationEntity>("Notification", notificationSchema);

export default NotificationModel;