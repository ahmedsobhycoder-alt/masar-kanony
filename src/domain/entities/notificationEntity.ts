import { Types } from "mongoose";

export interface NotificationEntity {
  id?: Types.ObjectId | string;
  _id?: Types.ObjectId | string;
  title: string;
  body: string;
  userId: Types.ObjectId | string;
  type?: string;
  isRead?: boolean;
  data?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export default NotificationEntity;