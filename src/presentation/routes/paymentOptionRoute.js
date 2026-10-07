"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const paymentOptionValidator_1 = require("../validators/paymentOptionValidator");
const express_1 = require("express");
const pamentOptionController_1 = __importDefault(require("../controllers/pamentOptionController"));
const paymentOptionUseCases_1 = __importDefault(require("../../domain/usecases/paymentOptionUseCases"));
const paymentOptionRepoImpl_1 = __importDefault(require("../../infrastructure/database/repositories/paymentOptionRepoImpl"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const user_roles_enum_1 = __importDefault(require("../../shared/constants/user-roles.enum"));
const paymentOptionRouter = (0, express_1.Router)();
const paymentOptionController = new pamentOptionController_1.default(new paymentOptionUseCases_1.default({ paymentOptionRepo: paymentOptionRepoImpl_1.default }));
paymentOptionRouter
    .post("/", authMiddleware_1.protect, (0, authMiddleware_1.allowedTo)([user_roles_enum_1.default.ADMIN]), paymentOptionValidator_1.createPaymentOptionValidator, paymentOptionController.createPaymentOption)
    .get("/", paymentOptionController.getPaymentOptions);
exports.default = paymentOptionRouter;
