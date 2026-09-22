import { check } from "express-validator";
import validatorMiddleware from "../middlewares/validatorMiddleWare";

export const getUserByIdValidator = [
    check("id").isMongoId().withMessage("User ID must be a valid Mongo ID"),
    validatorMiddleware,
];

export const deleteUserByIdValidator = [
    check("id").isMongoId().withMessage("User ID must be a valid Mongo ID"),
    validatorMiddleware,
];
