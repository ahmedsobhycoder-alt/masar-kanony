"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../controllers/authController"));
const authValidaor_1 = require("../validators/authValidaor");
const authUseCases_1 = require("../../domain/usecases/authUseCases");
const authRepoImpl_1 = __importDefault(require("../../infrastructure/database/repositories/authRepoImpl"));
const authRouter = (0, express_1.Router)();
const authController = new authController_1.default(new authUseCases_1.AuthUseCases({ userRepo: authRepoImpl_1.default }));
authRouter
    .post("/signup", authValidaor_1.signUpValidator, authController.signup)
    .post("/verify", authValidaor_1.verifyValidator, authController.verify)
    .post("/login", authValidaor_1.loginValidator, authController.login)
    .post("/forgetPassword", authValidaor_1.forgetPasswordValidator, authController.forgetPassword)
    .post("/verifyResetCode", authValidaor_1.verifyResetCodeValidator, authController.verifyResetCode)
    .post("/resetPassword", authValidaor_1.resetPasswordValidator, authController.resetPassword);
exports.default = authRouter;
