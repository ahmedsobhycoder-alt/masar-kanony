import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import NotificationUseCases from "../../domain/usecases/notificationsUseCases";
import { formatJson } from "../../shared/utils/formatJson"; 
import ApiError from "../../shared/errors/apiError";
import UserModel from "../../infrastructure/database/models/userModel";
import NotificationModel from "../../infrastructure/database/models/notificationModel";
import { getFcm } from "../../infrastructure/services/firebaseService";

export class NotificationController {
  private readonly notificationUseCases: NotificationUseCases;

  constructor(notificationUseCases: NotificationUseCases) {
    this.notificationUseCases = notificationUseCases;
  }

  createNotification = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { title, body, userId, audience = "user", type = "GENERAL", data = {} } = req.body;
      const filter = audience === "all" ? { active: true } : { _id: userId, active: true };
      if (audience !== "all" && !(await UserModel.exists(filter))) throw new ApiError(404, "User not found");
      const delivery = { recipients: 0, sent: 0, failed: 0, noDevice: 0 };
      const messaging = getFcm();
      const payload = Object.fromEntries(Object.entries(data).map(([key, value]) => [key, typeof value === "string" ? value : JSON.stringify(value)]));
      for await (const user of UserModel.find(filter).select("_id fcmTokens").cursor()) {
        await NotificationModel.create({ title, body, userId: user._id, type, data });
        delivery.recipients++;
        const tokens = [...new Set<string>((user.fcmTokens || []).map(String).filter(Boolean))];
        if (!tokens.length) delivery.noDevice++;
        for (let offset = 0; offset < tokens.length; offset += 500) {
          const batch = tokens.slice(offset, offset + 500);
          try {
            const result = await messaging.sendEachForMulticast({ tokens: batch, notification: { title, body }, data: payload });
            delivery.sent += result.successCount;
            delivery.failed += result.failureCount;
            const invalid = result.responses.flatMap((response, index) => ["messaging/registration-token-not-registered", "messaging/invalid-registration-token"].includes(response.error?.code || "") ? [batch[index]] : []);
            if (invalid.length) await UserModel.updateOne({ _id: user._id }, { $pull: { fcmTokens: { $in: invalid } } });
          } catch { delivery.failed += batch.length; }
        }
      }
      const createdNotification = delivery;

      res.status(201).json(
        formatJson({
          data: createdNotification,
          message: req.t("Notification created successfully", { ns: "common" }),
          status: true,
        })
      );
    }
  );
  registerToken = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user._id;
    const update = req.method === "DELETE" ? { $pull: { fcmTokens: req.body.token } } : { $addToSet: { fcmTokens: req.body.token } };
    await UserModel.updateOne({ _id: userId }, update);
    res.json(formatJson({ data: null, message: "Device token updated", status: true }));
  });

  getAllNotifications = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const query = req.query;

      const { data, pagination } =
        (await this.notificationUseCases.getNotifications(query)) as any;

      res.status(200).json(
        formatJson({
          data: {
            list: data,
            paginationResult: pagination,
          },
          message: req.t("Notifications fetched successfully", { ns: "common" }),
          status: true,
        })
      );
    }
  );

  getMyNotifications = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const query = {
        ...req.query,
        userId: (req as any).user?.id || (req as any).user?._id,
      };

      const { data, pagination } =
        (await this.notificationUseCases.getNotifications(query)) as any;

      res.status(200).json(
        formatJson({
          data: {
            list: data,
            paginationResult: pagination,
          },
          message: req.t("Notifications fetched successfully", { ns: "common" }),
          status: true,
        })
      );
    }
  );

  getNotificationById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const notification = await this.notificationUseCases.getNotificationById(
        req.params.id as string
      );

      if (!notification) throw new ApiError(404, "Notification not found");

      res.status(200).json(
        formatJson({
          data: notification,
          message: req.t("Notification fetched successfully", { ns: "common" }),
          status: true,
        })
      );
    }
  );

  markAsRead = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const notification = await this.notificationUseCases.markAsRead(
        req.params.id as string
      );

      if (!notification) throw new ApiError(404, "Notification not found");

      res.status(200).json(
        formatJson({
          data: notification,
          message: req.t("Notification marked as read", { ns: "common" }),
          status: true,
        })
      );
    }
  );

  markAllAsRead = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = (req as any).user?.id || (req as any).user?._id;
      const count = await this.notificationUseCases.markAllAsRead(userId);

      res.status(200).json(
        formatJson({
          data: { updatedCount: count },
          message: req.t("All notifications marked as read", { ns: "common" }),
          status: true,
        })
      );
    }
  );

  deleteNotification = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const notification =
        await this.notificationUseCases.deleteNotificationById(
          req.params.id as string
        );

      if (!notification) throw new ApiError(404, "Notification not found");

      res.status(200).json(
        formatJson({
          data: notification,
          message: req.t("Notification deleted successfully", { ns: "common" }),
          status: true,
        })
      );
    }
  );
}

export default NotificationController;