import { Router } from "express";

import OfficesController from "../controllers/officesController";
import OfficeUseCases from "../../domain/usecases/officeUseCases";
import { createOfficeValidator } from "../validators/officeValidator";
import  officeRepoImpl  from "../../infrastructure/database/repositories/officeRepoImpl";

const officeRouter = Router();
const officeController = new OfficesController({
  officeUseCases: new OfficeUseCases({ officeRepo: officeRepoImpl }),
});

officeRouter
  .post("/", createOfficeValidator, officeController.createOffice)
  .get("/", officeController.getOffices);

export default officeRouter;
