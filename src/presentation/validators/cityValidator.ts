import { check } from "express-validator";
import validatorMiddleware from "../middlewares/validatorMiddleWare";
import GovernorateModel from "../../infrastructure/database/models/governorateModel";
import { throwError } from "../../shared/utils/helpers";

export const createCityValidator = [
  check("name")
    .notEmpty()
    .withMessage("City name is required")
    .trim(),

  check("governorate")
    .notEmpty()
    .withMessage("Governorate is required")
    .isMongoId()
    .withMessage("Governorate must be a valid Mongo ID")
    .custom(async (governorate) => {
      const governorateRecord = await GovernorateModel.findById(governorate);

      if (!governorateRecord) {
        return throwError(400, "Governorate does not exist");
      }

      return true;
    }),

  validatorMiddleware,
];

export const getCityByIdValidator = [
  check("id")
    .isMongoId()
    .withMessage("City ID must be a valid Mongo ID"),
  validatorMiddleware,
];
