import { Request, Response, Router } from "express";
import UserController from "../controllers/userController";
import UserUseCases from "../../domain/usecases/userUseCases";
import userRepoImpl from "../../infrastructure/database/repositories/userRepoImpl";
import { getUserByIdValidator, deleteUserByIdValidator } from "../validators/userValidator";
import { allowedTo, protect } from "../middlewares/authMiddleware";
import UserRole from "src/shared/constants/user-roles.enum";
import { verify } from "node:crypto";
import { throwError } from "src/shared/utils/helpers";
import UserEntity from "src/domain/entities/userEntity";
import UserModel from "src/infrastructure/database/models/userModel";
import asyncHandler from "express-async-handler";
const userRouter = Router();
const userController = new UserController({
    userUseCases: new UserUseCases({ userRepo: userRepoImpl }),
});
const verifyEmailChangeRequest = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    // 1. Ensure an email change was actually requested
    if (!user.pendingEmail || !user.emailChangeOtp || !user.emailChangeOtpExpires) {

        throwError(400, "No pending email change request found");
    }
    // 2. Check expiration
    if (!user.emailChangeOtpExpires || new Date(user.emailChangeOtpExpires).getTime() < Date.now()) {        // Clear expired tokens
        user.pendingEmail = undefined;
        user.emailChangeOtp = undefined;
        user.emailChangeOtpExpires = undefined;

        await user.save({ validateModifiedOnly: true });

        throwError(400, "OTP has expired. Please request a new one");
    }
});

userRouter
    .get("/", userController.getUsers)
    .put("/", protect, allowedTo([UserRole.USER]), userController.
        updateUser)
    .post("/verify-email-change", protect, allowedTo([UserRole.USER]), verifyEmailChangeRequest, userController.verifyEmailChange)
    .get("/:id", getUserByIdValidator, userController.getUserById)
    .delete("/:id", deleteUserByIdValidator, userController.deleteUserById);

export default userRouter;
