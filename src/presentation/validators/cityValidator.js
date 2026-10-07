"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCityByIdValidator = exports.createCityValidator = void 0;
const express_validator_1 = require("express-validator");
const validatorMiddleWare_1 = __importDefault(require("../middlewares/validatorMiddleWare"));
const governorateModel_1 = __importDefault(require("../../infrastructure/database/models/governorateModel"));
const apiError_1 = __importDefault(require("../../shared/errors/apiError"));
exports.createCityValidator = [
    (0, express_validator_1.check)("name")
        .notEmpty()
        .withMessage("City name is required")
        .trim(),
    (0, express_validator_1.check)("governorate")
        .notEmpty()
        .withMessage("Governorate is required")
        .isMongoId()
        .withMessage("Governorate must be a valid Mongo ID")
        .custom(async (governorate) => {
        const governorateRecord = await governorateModel_1.default.findById(governorate);
        if (!governorateRecord) {
            throw new apiError_1.default(400, "Governorate does not exist");
        }
        return true;
    }),
    validatorMiddleWare_1.default,
];
exports.getCityByIdValidator = [
    (0, express_validator_1.check)("id")
        .isMongoId()
        .withMessage("City ID must be a valid Mongo ID"),
    validatorMiddleWare_1.default,
];
