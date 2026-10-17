import { Router } from "express";

import { FloorNameController } from "../controllers/floorNameController";
import { FloorNameUseCases } from "../../domain/usecases/floorNameUseCases";
import { createFloorNameValidator } from "../validators/floorNameValidator";
import floorNameRepoImpl from "../../infrastructure/database/repositories/floorNameRepoImpl";
import { protect, allowedTo } from "../middlewares/authMiddleware";
import UserRole from "../../shared/constants/user-roles.enum";
import { resourceIdValidator, resourceUpdateBodyValidator } from "../validators/adminResourceValidator";

const floorNameRouter = Router();
const floorNameController = new FloorNameController(
  new FloorNameUseCases({ floorNameRepo: floorNameRepoImpl })
);

floorNameRouter
  .post("/", protect, allowedTo([UserRole.ADMIN]), createFloorNameValidator, floorNameController.createFloorName)
  .put("/:id", protect, allowedTo([UserRole.ADMIN]), resourceIdValidator, resourceUpdateBodyValidator, floorNameController.updateFloorName)
  .delete("/:id", protect, allowedTo([UserRole.ADMIN]), resourceIdValidator, floorNameController.deleteFloorName)
  .get("/", floorNameController.getAllFloorNames)
  .get("/:id", floorNameController.getFloorNameById);

export default floorNameRouter;
