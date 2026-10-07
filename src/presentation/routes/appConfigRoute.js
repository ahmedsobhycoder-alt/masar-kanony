"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authMiddleware_1 = require("../middlewares/authMiddleware");
const user_roles_enum_1 = __importDefault(require("../../shared/constants/user-roles.enum"));
const express_1 = require("express");
const appConfigController_1 = __importDefault(require("../controllers/appConfigController"));
const appConfigUseCases_1 = __importDefault(require("../../domain/usecases/appConfigUseCases"));
const appConfigRepoImpl_1 = __importDefault(require("../../infrastructure/database/repositories/appConfigRepoImpl"));
const appConfigValidator_1 = require("../validators/appConfigValidator");
const appConfigRouter = (0, express_1.Router)();
const appConfigController = new appConfigController_1.default(new appConfigUseCases_1.default({ appConfigRepository: appConfigRepoImpl_1.default }));
appConfigRouter.post("/", authMiddleware_1.protect, (0, authMiddleware_1.allowedTo)([user_roles_enum_1.default.ADMIN]), appConfigValidator_1.createAppConfigValidator, appConfigController.createAppConfig);
appConfigRouter.get("/", appConfigController.getAppConfig);
appConfigRouter.put("/", authMiddleware_1.protect, (0, authMiddleware_1.allowedTo)([user_roles_enum_1.default.ADMIN]), appConfigValidator_1.updateAppConfigValidator, appConfigController.updateAppConfig);
exports.default = appConfigRouter;
