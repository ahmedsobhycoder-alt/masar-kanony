"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatJson_1 = require("../../shared/utils/formatJson");
class AuthController {
    userUseCases;
    constructor(userUseCases) {
        this.userUseCases = userUseCases;
    }
    signup = async (req, res) => {
        const userData = req.body;
        await this.userUseCases.signup(userData);
        res.status(201).json((0, formatJson_1.formatJson)({ message: req.t("Please verify your account , we have sent you an email", { ns: "common" }), status: true }));
    };
    verify = async (req, res) => {
        const code = req.body.otp;
        const email = req.body.email;
        const userAndToken = await this.userUseCases.verify(email, code);
        res.status(200).json((0, formatJson_1.formatJson)({ message: req.t("Account verified successfully", { ns: "common" }), status: true, data: userAndToken }));
    };
    login = async (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        const userAndToken = await this.userUseCases.login(email, password);
        res.status(200).json((0, formatJson_1.formatJson)({ message: req.t("logged in successfully", { ns: "common" }), status: true, data: userAndToken }));
    };
    forgetPassword = async (req, res) => {
        const email = req.body.email;
        await this.userUseCases.forgetPassword(email);
        res.status(200).json((0, formatJson_1.formatJson)({ message: req.t("Please check your email, we have sent code to you an email", { ns: "common" }), status: true }));
    };
    verifyResetCode = async (req, res) => {
        const email = req.body.email;
        const resetCode = req.body.resetCode;
        await this.userUseCases.verifyResetCode(email, resetCode);
        res.status(200).json((0, formatJson_1.formatJson)({ message: req.t("Reset code verified. You can now change your password.", { ns: "common" }), status: true }));
    };
    resetPassword = async (req, res) => {
        const email = req.body.email;
        const newPassword = req.body.newPassword;
        await this.userUseCases.resetPassword(email, newPassword);
        res.status(200).json((0, formatJson_1.formatJson)({ message: req.t("Password changed successfully", { ns: "common" }), status: true }));
    };
}
exports.default = AuthController;
