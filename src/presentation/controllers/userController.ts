import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { formatJson } from "../../shared/utils/formatJson";
import UserUseCases from "../../domain/usecases/userUseCases";

export class UserController {
    private readonly userUseCases: UserUseCases;

    constructor({ userUseCases }: { userUseCases: UserUseCases }) {
        this.userUseCases = userUseCases;
    }

    getUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { data, pagination } = await this.userUseCases.getUsers(req.query as Record<string, any>);

        res.status(200).json(
            formatJson({
                data: { list: data, paginationResult: pagination },
                message: req.t("Users fetched successfully", { ns: "common" }),
                status: true,
            })
        );
    });

    getUserById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.id as string;
        const user = await this.userUseCases.getUserById(userId);

        res.status(200).json(
            formatJson({
                data: user,
                message: req.t("User fetched successfully", { ns: "common" }),
                status: true,
            })
        );
    });

    deleteUserById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.id as string;
        const deletedUser = await this.userUseCases.deleteUserById(userId);

        res.status(200).json(
            formatJson({
                data: deletedUser,
                message: req.t("User deleted successfully", { ns: "common" }),
                status: true,
            })
        );
    });
    updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        const updatedUser = await this.userUseCases.updateUser(user, req.body);
        if (req.body.email) {
            res.status(200).json({ status: "success", message: "OTP sent to your new email" });
        } else {
            res.status(200).json(
                formatJson({
                    data: updatedUser,
                    message: req.t("User updated successfully", { ns: "common" }),
                    status: true,
                })
            )
        }


    })
    verifyEmailChange = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        const updatedUser = await this.userUseCases.verifyEmailChange(user, req.body.otp);
        res.status(200).json(
            formatJson({
                data: updatedUser,
                message: req.t("Email changed successfully", { ns: "common" }),
                status: true,
            })
        )
    })
}

export default UserController;
