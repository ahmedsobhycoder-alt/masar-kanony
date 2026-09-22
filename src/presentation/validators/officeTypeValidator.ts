import { check } from "express-validator";

import validatorMiddleware from "../middlewares/validatorMiddleWare";

export const createOfficeTypeValidator = [
  check("name").notEmpty().withMessage("Office type name is required").trim(),
  check("description").optional({ nullable: true }).trim(),
  validatorMiddleware,
];
