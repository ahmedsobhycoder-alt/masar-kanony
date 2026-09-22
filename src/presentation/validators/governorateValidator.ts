import { check } from "express-validator";

import validatorMiddleware from "../middlewares/validatorMiddleWare";

export const createGovernorateValidator = [
  check("name")
    .notEmpty()
    .withMessage("Governorate name is required")
    .trim(),
  validatorMiddleware,
];
