import { Router } from "express";
import AppPolicyController from "../controllers/appPolicyController";
import AppPolicyUseCases from "../../domain/usecases/appPolicyUseCases";
import appPolicyRepoImpl from "../../infrastructure/database/repositories/appPolicyRepoImpl";
import { protect, allowedTo } from "../middlewares/authMiddleware";
import { UserRole } from "../../shared/constants/user-roles.enum";
import { createAppPolicyValidator, updateAppPolicyValidator} from "../validators/appPolicyValidator";

const appPolicyRouter = Router({ mergeParams: true });
const appPolicyController = new AppPolicyController(new AppPolicyUseCases({ appPolicyRepo: appPolicyRepoImpl }));

appPolicyRouter.get("/", protect, appPolicyController.getAppPolicy);
appPolicyRouter.post("/:type", protect, allowedTo([UserRole.ADMIN]), createAppPolicyValidator, appPolicyController.createAppPolicy);
appPolicyRouter.get("/:type", protect, appPolicyController.getAppPolicy);
appPolicyRouter.put("/:type", protect, allowedTo([UserRole.ADMIN]), updateAppPolicyValidator, appPolicyController.updateAppPolicy);
// appPolicyRouter.delete("/:type", protect, allowedTo([UserRole.ADMIN]), appPolicyController.deleteAppPolicy);

export default appPolicyRouter;