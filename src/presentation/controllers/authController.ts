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
        res.status(201).json(formatJson({ message: "Please verify your account , we have sent you an email", status: true }));
    };
    verify = async (req: any, res: any) => {
        const code = req.body.otp;
        const email = req.body.email;
        const userAndToken=await this.userUseCases.verify(email,code);
        res.status(200).json(formatJson({ message: "Account verified successfully", status: true, data: userAndToken }));
    };
    login = async (req: any, res: any) => {
        const email = req.body.email;
        const password = req.body.password;

        const userAndToken=await this.userUseCases.login(email, password);
            res.status(200).json(formatJson({ message: "logged in successfully", status: true, data: userAndToken }));
    };
    forgetPassword = async (req: any, res: any) => {
        const email = req.body.email;
        await this.userUseCases.forgetPassword(email);
        res.status(200).json(formatJson({ message: "Please check your email, we have sent code to you an email", status: true }));
    };
    verifyResetCode = async (req: any, res: any) => {
        const email = req.body.email;
        const resetCode = req.body.resetCode;
        await this.userUseCases.verifyResetCode(email, resetCode);
        res.status(200).json(formatJson({ message: "Reset code verified. You can now change your password.", status: true }));
    };
    resetPassword = async (req: any, res: any) => {
        const email = req.body.email;
        const newPassword = req.body.newPassword;
        await this.userUseCases.resetPassword(email, newPassword);
        res.status(200).json(formatJson({ message: "Password changed successfully", status: true }));
    };
}
export default AuthController;