import { Router } from "express";

import { OfficeTypeController } from "../controllers/officeTypeController";
import { OfficeTypeUseCases } from "../../domain/usecases/officeTypeUseCases";
import { createOfficeTypeValidator, updateOfficeTypeValidator } from "../validators/officeTypeValidator";
import officeTypeRepoImpl from "../../infrastructure/database/repositories/officeTypeRepoImpl";

import { protect, allowedTo } from "../middlewares/authMiddleware";
import UserRole from "../../shared/constants/user-roles.enum";
import { resourceIdValidator, resourceUpdateBodyValidator } from "../validators/adminResourceValidator";
const officeTypeRouter = Router();
const officeTypeController = new OfficeTypeController(
  new OfficeTypeUseCases({ officeTypeRepo: officeTypeRepoImpl })
);

officeTypeRouter
  .post("/", protect, allowedTo([UserRole.ADMIN]), createOfficeTypeValidator, officeTypeController.createOfficeType)
  .put("/:id", protect, allowedTo([UserRole.ADMIN]), resourceIdValidator, resourceUpdateBodyValidator, updateOfficeTypeValidator, officeTypeController.updateOfficeType)
  .delete("/:id", protect, allowedTo([UserRole.ADMIN]), resourceIdValidator, officeTypeController.deleteOfficeType)
  .get("/", officeTypeController.getAllOfficeTypes)
  .get("/:id", officeTypeController.getOfficeTypeById);

export default officeTypeRouter;
