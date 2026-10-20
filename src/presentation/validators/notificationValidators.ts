import { body, check } from "express-validator";
import validatorMiddleware from "../middlewares/validatorMiddleWare";
import NotificationModel from "../../infrastructure/database/models/notificationModel";
import { throwError } from "../../shared/utils/helpers";

export const createNotificationValidator = [
  body("title")
    .isString().bail().trim().notEmpty()
    .withMessage("Notification title is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be at least 3 characters"),

  body("body")
    .isString().bail().trim().notEmpty()
    .withMessage("Notification body is required")
    .isLength({ min: 5, max: 2000 })
    .withMessage("Body must be at least 5 characters"),

  body("audience").optional().isIn(["user", "all"]),
  body("userId").if((_value, { req }) => req.body.audience !== "all").isMongoId().withMessage("A valid user is required"),
  check("type").optional().isString(),
  body("data").optional().isObject().bail().custom((data) => {
    if (Buffer.byteLength(JSON.stringify(data), "utf8") > 1000) throw new Error("Notification data is too large");
    if (Object.keys(data).some((key) => /^(from|message_type|google\.|gcm\.)/.test(key))) throw new Error("Reserved notification data key");
    return true;
  }),

  body().custom((data) => {
    const size = Buffer.byteLength(JSON.stringify({ title: data.title, body: data.body, data: data.data || {} }), "utf8");
    if (size > 3500) throw new Error("Notification payload is too large");
    return true;
  }),
  validatorMiddleware,
];

export const getNotificationValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Notification ID format")
    .custom(async (id, { req }) => {
      const notification = await NotificationModel.findById(id);
      if (!notification) {
        throwError(404, "Notification does not exist");
      }
      if (req.user?.role !== "admin" && String(notification.userId) !== String(req.user?._id)) {
        throwError(404, "Notification does not exist");
      }
      return true;
    }),
  validatorMiddleware,
];

export const deleteNotificationValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Notification ID format")
    .custom(async (id, { req }) => {
      const notification = await NotificationModel.findById(id);
      if (!notification) {
        throwError(404, "Notification does not exist");
      }
      if (req.user?.role !== "admin" && String(notification.userId) !== String(req.user?._id)) {
        throwError(404, "Notification does not exist");
      }
      return true;
    }),
  validatorMiddleware,
];