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
                message: "Users fetched successfully",
                status: "success",
            })
        );
    });

    getUserById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.id as string;
        const user = await this.userUseCases.getUserById(userId);

        res.status(200).json(
            formatJson({
                data: user,
                message: "User fetched successfully",
                status: "success",
            })
        );
    });

    deleteUserById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.id as string;
        const deletedUser = await this.userUseCases.deleteUserById(userId);

        res.status(200).json(
            formatJson({
                data: deletedUser,
                message: "User deleted successfully",
                status: "success",
            })
        );
    });
}

export default UserController;
