import NotificationRepo from "../../../domain/repositories/notificationRepo";
import NotificationEntity from "../../../domain/entities/notificationEntity";
import NotificationModel from "../models/notificationModel";
import listType from "../../../shared/constants/types";
import { QueryBuilder } from "../../../shared/utils/queryBuilder";
import { printYellow } from "../../../shared/utils/printColors";


class NotificationRepoImpl implements NotificationRepo {
  async createNotification(data: Partial<NotificationEntity>): Promise<NotificationEntity> {
    const notification = await NotificationModel.create(data);
    return notification.toObject();
  }

async getNotifications(query: Record<string, any>): Promise<listType<NotificationEntity>> {
    const queryBuilder: QueryBuilder = new QueryBuilder<NotificationEntity>(NotificationModel, query);
    printYellow("query", JSON.stringify(query));
    return await queryBuilder
      .filter()
      .sort()
      .limitFields()
      .paginate()
      .execute();
  }

  async getNotificationById(id: string): Promise<NotificationEntity | null> {
    const notification = await NotificationModel.findById(id).lean();
    return notification as NotificationEntity | null;
  }

  async markAsRead(id: string): Promise<NotificationEntity | null> {
    const updated = await NotificationModel.findByIdAndUpdate(
      id,
      { $set: { isRead: true } },
      { new: true }
    ).lean();
    return updated as NotificationEntity | null;
  }

  async markAllAsRead(userId: string): Promise<number> {
    const result = await NotificationModel.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } }
    );
    return result.modifiedCount;
  }

  async deleteNotificationById(id: string): Promise<NotificationEntity | null> {
    const deleted = await NotificationModel.findByIdAndDelete(id).lean();
    return deleted as NotificationEntity | null;
  }
}

export default NotificationRepoImpl;