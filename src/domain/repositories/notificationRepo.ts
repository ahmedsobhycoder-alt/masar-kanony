import NotificationEntity from "../entities/notificationEntity";
import listType from "../../shared/constants/types";

export default interface NotificationRepo {
  createNotification(data: Partial<NotificationEntity>): Promise<NotificationEntity>;
  getNotifications(query: Record<string, any>): Promise<listType<NotificationEntity>>;
  getNotificationById(id: string): Promise<NotificationEntity | null>;
  markAsRead(id: string): Promise<NotificationEntity | null>;
  markAllAsRead(userId: string): Promise<number>;
  deleteNotificationById(id: string): Promise<NotificationEntity | null>;
}