import { allowedTo, protect } from "../middlewares/authMiddleware";
import UserRole from "../../shared/constants/user-roles.enum";
import { Router } from "express";
import AppConfigController from "../controllers/appConfigController";
import AppConfigUseCases from "../../domain/usecases/appConfigUseCases";
import appConfigRepoImpl from "../../infrastructure/database/repositories/appConfigRepoImpl";
import { createAppConfigValidator, updateAppConfigValidator } from "../validators/appConfigValidator";
const appConfigRouter = Router();
const appConfigController = new AppConfigController(
    new AppConfigUseCases({ appConfigRepository: appConfigRepoImpl })
);
appConfigRouter.post("/",protect, allowedTo([UserRole.ADMIN]), createAppConfigValidator, appConfigController.createAppConfig);
appConfigRouter.get("/",protect, appConfigController.getAppConfig);
appConfigRouter.put("/",protect, allowedTo([UserRole.ADMIN]), updateAppConfigValidator, appConfigController.updateAppConfig);
export default appConfigRouter;