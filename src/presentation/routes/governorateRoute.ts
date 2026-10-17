import { Router } from "express";

import { GovernorateController } from "../controllers/governorateController";
import { GovernorateUseCases } from "../../domain/usecases/governorateUseCases";
import { createGovernorateValidator } from "../validators/governorateValidator";
import governorateRepoImpl from "../../infrastructure/database/repositories/governorateRepoImpl";
import { protect, allowedTo } from "../middlewares/authMiddleware";
import UserRole from "../../shared/constants/user-roles.enum";
import { resourceIdValidator, resourceUpdateBodyValidator } from "../validators/adminResourceValidator";

const governorateRouter = Router();
const governorateController = new GovernorateController(
  new GovernorateUseCases({ governorateRepo: governorateRepoImpl })
);

governorateRouter
  .post("/", protect, allowedTo([UserRole.ADMIN]), createGovernorateValidator, governorateController.createGovernorate)
  .put("/:id", protect, allowedTo([UserRole.ADMIN]), resourceIdValidator, resourceUpdateBodyValidator, governorateController.updateGovernorate)
  .delete("/:id", protect, allowedTo([UserRole.ADMIN]), resourceIdValidator, governorateController.deleteGovernorate)
  .get("/", governorateController.getAllGovernorates)
  .get("/:id", governorateController.getGovernorateById);

export default governorateRouter;
