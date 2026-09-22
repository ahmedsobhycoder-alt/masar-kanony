import { Router } from "express";
import AuthController from "../controllers/authController";
import {
    signUpValidator,
    verifyValidator,
    loginValidator,
    forgetPasswordValidator,
    verifyResetCodeValidator,
    resetPasswordValidator,
} from "../validators/authValidaor";
import { AuthUseCases } from "../../domain/usecases/authUseCases";
import authRepoImpl from "../../infrastructure/database/repositories/authRepoImpl";

const authRouter = Router();
const authController = new AuthController(new AuthUseCases({ userRepo: authRepoImpl }));

authRouter
    .post("/signup", signUpValidator, authController.signup)
    .post("/verify", verifyValidator, authController.verify)
    .post("/login", loginValidator, authController.login)
    .post("/forgetPassword", forgetPasswordValidator, authController.forgetPassword)
    .post("/verifyResetCode", verifyResetCodeValidator, authController.verifyResetCode)
    .post("/resetPassword", resetPasswordValidator, authController.resetPassword);

export default authRouter;