import { Router } from "express";

import { CourtTypeController } from "../controllers/courtTypeController";
import { CourtTypeUseCases } from "../../domain/usecases/courtTypeUseCases";
import { createCourtTypeValidator } from "../validators/courtTypeValidator";
import courtTypeRepoImpl from "../../infrastructure/database/repositories/courtTypeRepoImpl";

const courtTypeRouter = Router();
const courtTypeController = new CourtTypeController(
  new CourtTypeUseCases({ courtTypeRepo: courtTypeRepoImpl })
);

courtTypeRouter
  .post("/", createCourtTypeValidator, courtTypeController.createCourtType)
  .get("/", courtTypeController.getAllCourtTypes)
  .get("/:id", courtTypeController.getCourtTypeById);

export default courtTypeRouter;
