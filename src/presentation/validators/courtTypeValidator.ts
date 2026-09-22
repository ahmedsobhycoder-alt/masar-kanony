import { check } from "express-validator";

import validatorMiddleware from "../middlewares/validatorMiddleWare";

export const createCourtTypeValidator = [
  check("name").notEmpty().withMessage("Court type name is required").trim(),
  check("description").optional({ nullable: true }).trim(),
  validatorMiddleware,
];
