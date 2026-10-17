import { body, check } from "express-validator";
import validatorMiddleware from "../middlewares/validatorMiddleWare";

export const resourceIdValidator = [
  check("id").isMongoId().withMessage("Invalid resource ID"),
  validatorMiddleware,
];

export const resourceUpdateBodyValidator = [
  body().isObject().withMessage("Update data must be an object").bail().custom((data) => {
    if (!Object.keys(data).length) throw new Error("At least one update field is required");
    return true;
  }),
  validatorMiddleware,
];
