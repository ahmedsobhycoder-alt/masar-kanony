import NotificationRepo from "../repositories/notificationRepo";
import NotificationEntity from "../entities/notificationEntity";
import listType from "../../shared/constants/types";

export class NotificationUseCases {
  readonly notificationRepo: NotificationRepo;

  constructor({ notificationRepo }: { notificationRepo: NotificationRepo }) {
    this.notificationRepo = notificationRepo;
  }

  createNotification = (data: Partial<NotificationEntity>): Promise<NotificationEntity> =>
    this.notificationRepo.createNotification(data);

  getNotifications = (
    query: Record<string, any>
  ): Promise<listType<NotificationEntity>> =>
    this.notificationRepo.getNotifications(query);

  getNotificationById = (id: string): Promise<NotificationEntity | null> =>
    this.notificationRepo.getNotificationById(id);

  markAsRead = (id: string): Promise<NotificationEntity | null> =>
    this.notificationRepo.markAsRead(id);

  markAllAsRead = (userId: string): Promise<number> =>
    this.notificationRepo.markAllAsRead(userId);

  deleteNotificationById = (id: string): Promise<NotificationEntity | null> =>
    this.notificationRepo.deleteNotificationById(id);
}

export default NotificationUseCases;