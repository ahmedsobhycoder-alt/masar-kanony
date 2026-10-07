"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteByIdValidator = exports.createAdValidator = void 0;
const express_validator_1 = require("express-validator");
const adsModel_1 = __importDefault(require("../../infrastructure/database/models/adsModel"));
const validatorMiddleWare_1 = __importDefault(require("../middlewares/validatorMiddleWare"));
const apiError_1 = __importDefault(require("../../shared/errors/apiError"));
exports.createAdValidator = [
    (0, express_validator_1.check)("title").notEmpty().withMessage("Ad title is required").trim(),
    (0, express_validator_1.check)("description").notEmpty().withMessage("Ad description is required").trim(),
    (0, express_validator_1.check)("link").notEmpty().withMessage("Ad link is required").trim(),
    validatorMiddleWare_1.default,
];
exports.deleteByIdValidator = [
    (0, express_validator_1.check)("id").isMongoId().withMessage("Ad id is required").trim().custom(async (id) => {
        const isAdExisted = await adsModel_1.default.exists({ _id: id });
        if (!isAdExisted) {
            throw new apiError_1.default(400, "Ad does not exist");
        }
    }),
    validatorMiddleWare_1.default,
];
