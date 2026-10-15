import { check } from "express-validator";
import AdsModel from "../../infrastructure/database/models/adsModel";
import validatorMiddleware from "../middlewares/validatorMiddleWare";
import { throwError } from "../../shared/utils/helpers";
export const createAdValidator = [
  check("title").notEmpty().withMessage("Ad title is required").trim(),
  check("description").notEmpty().withMessage("Ad description is required").trim(),
    check("link").notEmpty().withMessage("Ad link is required").trim(),
  validatorMiddleware,
];
export const deleteByIdValidator = [
  check("id").isMongoId().withMessage("Ad id is required").trim().custom(async (id) => {
    const isAdExisted = await AdsModel.exists({ _id: id });
    if (!isAdExisted) {
      return throwError(400, "Ad does not exist");
    }
  }),
  validatorMiddleware,
];
