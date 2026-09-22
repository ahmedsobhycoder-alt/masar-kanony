import { Router } from "express";

import { FloorNameController } from "../controllers/floorNameController";
import { FloorNameUseCases } from "../../domain/usecases/floorNameUseCases";
import { createFloorNameValidator } from "../validators/floorNameValidator";
import floorNameRepoImpl from "../../infrastructure/database/repositories/floorNameRepoImpl";

const floorNameRouter = Router();
const floorNameController = new FloorNameController(
  new FloorNameUseCases({ floorNameRepo: floorNameRepoImpl })
);

floorNameRouter
  .post("/", createFloorNameValidator, floorNameController.createFloorName)
  .get("/", floorNameController.getAllFloorNames)
  .get("/:id", floorNameController.getFloorNameById);

export default floorNameRouter;
