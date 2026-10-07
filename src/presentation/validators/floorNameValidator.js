"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFloorNameValidator = void 0;
const express_validator_1 = require("express-validator");
const validatorMiddleWare_1 = __importDefault(require("../middlewares/validatorMiddleWare"));
exports.createFloorNameValidator = [
    (0, express_validator_1.check)("name")
        .notEmpty()
        .withMessage("Floor name is required")
        .trim(),
    validatorMiddleWare_1.default,
];
