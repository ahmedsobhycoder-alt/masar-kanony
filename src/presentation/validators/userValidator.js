"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserByIdValidator = exports.getUserByIdValidator = void 0;
const express_validator_1 = require("express-validator");
const validatorMiddleWare_1 = __importDefault(require("../middlewares/validatorMiddleWare"));
exports.getUserByIdValidator = [
    (0, express_validator_1.check)("id").isMongoId().withMessage("User ID must be a valid Mongo ID"),
    validatorMiddleWare_1.default,
];
exports.deleteUserByIdValidator = [
    (0, express_validator_1.check)("id").isMongoId().withMessage("User ID must be a valid Mongo ID"),
    validatorMiddleWare_1.default,
];
