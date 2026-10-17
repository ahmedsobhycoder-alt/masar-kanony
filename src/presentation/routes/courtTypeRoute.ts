import { Router } from "express";

import { CourtTypeController } from "../controllers/courtTypeController";
import { CourtTypeUseCases } from "../../domain/usecases/courtTypeUseCases";
import { createCourtTypeValidator } from "../validators/courtTypeValidator";
import { resourceIdValidator, resourceUpdateBodyValidator } from "../validators/adminResourceValidator";
import { protect, allowedTo } from "../middlewares/authMiddleware";
import UserRole from "../../shared/constants/user-roles.enum";
import courtTypeRepoImpl from "../../infrastructure/database/repositories/courtTypeRepoImpl";

const courtTypeRouter = Router();
const courtTypeController = new CourtTypeController(
  new CourtTypeUseCases({ courtTypeRepo: courtTypeRepoImpl })
);

courtTypeRouter
  .post("/", protect, allowedTo([UserRole.ADMIN]), createCourtTypeValidator, courtTypeController.createCourtType)
  .put("/:id", protect, allowedTo([UserRole.ADMIN]), resourceIdValidator, resourceUpdateBodyValidator, courtTypeController.updateCourtType)
  .delete("/:id", protect, allowedTo([UserRole.ADMIN]), resourceIdValidator, courtTypeController.deleteCourtType)
  .get("/", courtTypeController.getAllCourtTypes)
  .get("/:id", courtTypeController.getCourtTypeById);

export default courtTypeRouter;
