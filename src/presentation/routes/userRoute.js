"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
const userUseCases_1 = __importDefault(require("../../domain/usecases/userUseCases"));
const userRepoImpl_1 = __importDefault(require("../../infrastructure/database/repositories/userRepoImpl"));
const userValidator_1 = require("../validators/userValidator");
const userRouter = (0, express_1.Router)();
const userController = new userController_1.default({
    userUseCases: new userUseCases_1.default({ userRepo: userRepoImpl_1.default }),
});
userRouter
    .get("/", userController.getUsers)
    .get("/:id", userValidator_1.getUserByIdValidator, userController.getUserById)
    .delete("/:id", userValidator_1.deleteUserByIdValidator, userController.deleteUserById);
exports.default = userRouter;
