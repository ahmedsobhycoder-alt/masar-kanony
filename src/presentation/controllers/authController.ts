import UserModel from "../../infrastructure/database/models/userModel";
import UserEntity from "../../domain/entities/userEntity";
import UserUseCases from "../../domain/usecases/authUseCases";
import { formatJson } from "../../shared/utils/formatJson";

class AuthController {
    private readonly userUseCases: UserUseCases;
    constructor(userUseCases: UserUseCases) {
        this.userUseCases = userUseCases;
    }
    signup = async (req: any, res: any) => {
        const userData: UserEntity = req.body;
        await this.userUseCases.signup(userData);
        res.status(201).json(formatJson({ message: req.t("Please verify your account , we have sent you an email", { ns: "common" }), status: true }));
    };
    verify = async (req: any, res: any) => {
        const code = req.body.otp;
        const email = req.body.email;
        const userAndToken=await this.userUseCases.verify(email,code);
        res.status(200).json(formatJson({ message: req.t("Account verified successfully", { ns: "common" }), status: true, data: userAndToken }));
    };
    login = async (req: any, res: any) => {
        const email = req.body.email;
        const password = req.body.password;

        const userAndToken=await this.userUseCases.login(email, password);
            res.status(200).json(formatJson({ message: req.t("logged in successfully", { ns: "common" }), status: true, data: userAndToken }));
    };
    forgetPassword = async (req: any, res: any) => {
        const email = req.body.email;
        await this.userUseCases.forgetPassword(email);
        res.status(200).json(formatJson({ message: req.t("Please check your email, we have sent code to you an email", { ns: "common" }), status: true }));
    };
    verifyResetCode = async (req: any, res: any) => {
        const email = req.body.email;
        const resetCode = req.body.resetCode;
        await this.userUseCases.verifyResetCode(email, resetCode);
        res.status(200).json(formatJson({ message: req.t("Reset code verified. You can now change your password.", { ns: "common" }), status: true }));
    };
    resetPassword = async (req: any, res: any) => {
        const email = req.body.email;
        const newPassword = req.body.newPassword;
        await this.userUseCases.resetPassword(email, newPassword);
        res.status(200).json(formatJson({ message: req.t("Password changed successfully", { ns: "common" }), status: true }));
    };
}
export default AuthController;