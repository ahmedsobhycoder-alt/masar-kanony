import { Types } from "mongoose";
import { SubscriptionStatus } from "../../shared/constants/payment-status.enums";

export interface SubscriptionEntity {
  id?: string;
  _id?: Types.ObjectId | string;
  user: Types.ObjectId | string;
  plan: Types.ObjectId | string;
  payment: Types.ObjectId | string; // The approved payment receipt
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}