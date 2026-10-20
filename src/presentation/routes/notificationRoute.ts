import { body } from "express-validator";
import validatorMiddleware from "../middlewares/validatorMiddleWare";
import { Router } from "express";

import { NotificationController } from "../controllers/notificationController";
import NotificationUseCases from "../../domain/usecases/notificationsUseCases";
import NotificationRepoImpl from "../../infrastructure/database/repositories/notificationRepoImpl";
import {
  createNotificationValidator,
  getNotificationValidator,
  deleteNotificationValidator,
} from "../validators/notificationValidators";
import { protect, allowedTo } from "../middlewares/authMiddleware";
import UserRole from "../../shared/constants/user-roles.enum";

const notificationRouter = Router();

const notificationController = new NotificationController(
  new NotificationUseCases({ notificationRepo: new NotificationRepoImpl() })
);

// All notification operations require authentication
notificationRouter.use(protect);

notificationRouter.get("/admin", allowedTo([UserRole.ADMIN]), notificationController.getAllNotifications);
const tokenValidator = [body("token").isString().trim().notEmpty().isLength({ max: 4096 }), validatorMiddleware];
notificationRouter.post("/device-token", tokenValidator, notificationController.registerToken);
notificationRouter.delete("/device-token", tokenValidator, notificationController.registerToken);

// Current user notifications
notificationRouter
  .get("/", notificationController.getMyNotifications)
  .put("/mark-all-read", notificationController.markAllAsRead);

// Single notification operations
notificationRouter
  .route("/:id")
  .get(getNotificationValidator, notificationController.getNotificationById)
  .put(getNotificationValidator, notificationController.markAsRead)
  .delete(deleteNotificationValidator, notificationController.deleteNotification);

// Admin-only manual notification push
notificationRouter.post(
  "/",
  allowedTo([UserRole.ADMIN]),
  createNotificationValidator,
  notificationController.createNotification
);

export default notificationRouter;