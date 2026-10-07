"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUseCases = void 0;
class AuthUseCases {
    userRepo;
    constructor({ userRepo }) {
        this.userRepo = userRepo;
    }
    signup = async (userData) => this.userRepo.signup(userData);
    verify = async (email, code) => this.userRepo.verify(email, code);
    login = async (email, password) => this.userRepo.login(email, password);
    forgetPassword = async (email) => this.userRepo.forgetPassword(email);
    verifyResetCode = async (email, resetCode) => this.userRepo.verifyResetCode(email, resetCode);
    resetPassword = async (email, newPassword) => this.userRepo.resetPassword(email, newPassword);
}
exports.AuthUseCases = AuthUseCases;
exports.default = AuthUseCases;
