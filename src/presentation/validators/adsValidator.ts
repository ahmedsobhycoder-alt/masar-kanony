import { check } from "express-validator";

import validatorMiddleware from "../middlewares/validatorMiddleWare";

export const createAdValidator = [
  check("title").notEmpty().withMessage("Ad title is required").trim(),
  check("description").notEmpty().withMessage("Ad description is required").trim(),
  check("image").notEmpty().withMessage("Ad image is required").trim(),
  check("link").notEmpty().withMessage("Ad link is required").trim(),
  validatorMiddleware,
];
