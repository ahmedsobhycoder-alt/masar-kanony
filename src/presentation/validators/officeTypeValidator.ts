import { body } from "express-validator";
import validatorMiddleware from "../middlewares/validatorMiddleWare";

export const createOfficeTypeValidator = [
  body("name").isString().trim().notEmpty().withMessage("Office type name is required"),
  body("description").optional().isString().trim(),
  validatorMiddleware,
];
export const updateOfficeTypeValidator = [
  body("name").optional().isString().trim().notEmpty(),
  body("description").optional().isString().trim(),
  validatorMiddleware,
];
