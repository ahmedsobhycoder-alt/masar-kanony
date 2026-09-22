import { Router } from "express";

import { GovernorateController } from "../controllers/governorateController";
import { GovernorateUseCases } from "../../domain/usecases/governorateUseCases";
import { createGovernorateValidator } from "../validators/governorateValidator";
import governorateRepoImpl from "../../infrastructure/database/repositories/governorateRepoImpl";

const governorateRouter = Router();
const governorateController = new GovernorateController(
  new GovernorateUseCases({ governorateRepo: governorateRepoImpl })
);

governorateRouter
  .post("/", createGovernorateValidator, governorateController.createGovernorate)
  .get("/", governorateController.getAllGovernorates)
  .get("/:id", governorateController.getGovernorateById);

export default governorateRouter;
