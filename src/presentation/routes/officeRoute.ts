import { Router } from "express";

import OfficesController from "../controllers/officesController";
import OfficeUseCases from "../../domain/usecases/officeUseCases";
import { createOfficeValidator, getOfficeByIdValidator, getOfficeValidator, getSavedOfficesValidator, savedOfficeValidator, updateOfficeValidator } from "../validators/officeValidator";
import  officeRepoImpl  from "../../infrastructure/database/repositories/officeRepoImpl";
import { protect, allowedTo, optionalProtect } from "../middlewares/authMiddleware";
import UserRole from "../../shared/constants/user-roles.enum";
import { resourceIdValidator, resourceUpdateBodyValidator } from "../validators/adminResourceValidator";
import { Request, Response, NextFunction } from "express";
import ApiError from "../../shared/errors/apiError";
import OfficeEntity from "../../domain/entities/officeEntity";

const officeRouter = Router();
const officeController = new OfficesController({
  officeUseCases: new OfficeUseCases({ officeRepo: officeRepoImpl }),
});

const ensureNotSaved = (req: Request, res: Response, next: NextFunction) => {
  const office = (req as any).office as OfficeEntity;
  const user = (req as any).user;
  const alreadySaved = office.savedBy?.some((id: any) => id.toString() === user._id.toString());
  if (alreadySaved) return next(new ApiError(400, "You have already saved this office"));
  next();
};

const ensureAlreadySaved = (req: Request, res: Response, next: NextFunction) => {
  const office = (req as any).office as OfficeEntity;
  const user = (req as any).user;
  const alreadySaved = office.savedBy?.some((id: any) => id.toString() === user._id.toString());
  if (!alreadySaved) return next(new ApiError(400, "Office is not in your saved list"));
  next();
};

officeRouter.get("/saved", protect, allowedTo([UserRole.USER]), getSavedOfficesValidator, officeController.getSavedOffices);
officeRouter.post("/:officeId/save", protect, allowedTo([UserRole.USER]), savedOfficeValidator, ensureNotSaved, officeController.addToSaved);
officeRouter.post("/:officeId/remove", protect, allowedTo([UserRole.USER]), savedOfficeValidator, ensureAlreadySaved, officeController.removeFromSaved);

officeRouter
  .post("/", protect, allowedTo([UserRole.ADMIN]), createOfficeValidator, officeController.createOffice)
  .put("/:id", protect, allowedTo([UserRole.ADMIN]), resourceIdValidator, resourceUpdateBodyValidator, updateOfficeValidator, officeController.updateOffice)
  .delete("/:id", protect, allowedTo([UserRole.ADMIN]), resourceIdValidator, officeController.deleteOffice)
  .get("/:id", optionalProtect, getOfficeByIdValidator, officeController.getOfficeById)
  .get("/", optionalProtect, getOfficeValidator, officeController.getOffices);

export default officeRouter;
