import { Router } from "express";
import UserController from "../controllers/userController";
import UserUseCases from "../../domain/usecases/userUseCases";
import userRepoImpl from "../../infrastructure/database/repositories/userRepoImpl";
import { getUserByIdValidator, deleteUserByIdValidator } from "../validators/userValidator";

const userRouter = Router();
const userController = new UserController({
    userUseCases: new UserUseCases({ userRepo: userRepoImpl }),
});

userRouter
    .get("/", userController.getUsers)
    .get("/:id", getUserByIdValidator, userController.getUserById)
    .delete("/:id", deleteUserByIdValidator, userController.deleteUserById);

export default userRouter;
