import { Router } from "express";

import OfficesController from "../controllers/officesController";
import OfficeUseCases from "../../domain/usecases/officeUseCases";
import { createOfficeValidator } from "../validators/officeValidator";
import  officeRepoImpl  from "../../infrastructure/database/repositories/officeRepoImpl";
import { protect, allowedTo } from "../middlewares/authMiddleware";
import UserRole from "../../shared/constants/user-roles.enum";
import { resourceIdValidator, resourceUpdateBodyValidator } from "../validators/adminResourceValidator";

const officeRouter = Router();
const officeController = new OfficesController({
  officeUseCases: new OfficeUseCases({ officeRepo: officeRepoImpl }),
});

officeRouter
  .post("/", protect, allowedTo([UserRole.ADMIN]), createOfficeValidator, officeController.createOffice)
  .put("/:id", protect, allowedTo([UserRole.ADMIN]), resourceIdValidator, resourceUpdateBodyValidator, officeController.updateOffice)
  .delete("/:id", protect, allowedTo([UserRole.ADMIN]), resourceIdValidator, officeController.deleteOffice)
  .get("/", officeController.getOffices);

export default officeRouter;
