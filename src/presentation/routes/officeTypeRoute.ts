import { Router } from "express";

import { OfficeTypeController } from "../controllers/officeTypeController";
import { OfficeTypeUseCases } from "../../domain/usecases/officeTypeUseCases";
import { createOfficeTypeValidator } from "../validators/officeTypeValidator";
import officeTypeRepoImpl from "../../infrastructure/database/repositories/officeTypeRepoImpl";

const officeTypeRouter = Router();
const officeTypeController = new OfficeTypeController(
  new OfficeTypeUseCases({ officeTypeRepo: officeTypeRepoImpl })
);

officeTypeRouter
  .post("/", createOfficeTypeValidator, officeTypeController.createOfficeType)
  .get("/", officeTypeController.getAllOfficeTypes)
  .get("/:id", officeTypeController.getOfficeTypeById);

export default officeTypeRouter;
