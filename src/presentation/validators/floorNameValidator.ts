import { check } from "express-validator";

import validatorMiddleware from "../middlewares/validatorMiddleWare";

export const createFloorNameValidator = [
  check("name")
    .notEmpty()
    .withMessage("Floor name is required")
    .trim(),
  validatorMiddleware,
];
