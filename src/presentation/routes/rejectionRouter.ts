import { Router } from "express";

import { RejectionController } from "../controllers/rejectionController";
import RejectionUseCases from "../../domain/usecases/rejectionUseCases";
import {
  createRejectionValidator,
  getRejectionValidator,
  updateRejectionValidator,
  deleteRejectionValidator,
} from "../validators/rejectionValidator";
import RejectionRepoImpl from "../../infrastructure/database/repositories/rejectionRepoImpl";
import { protect, allowedTo } from "../middlewares/authMiddleware";
import UserRole from "../../shared/constants/user-roles.enum";

const rejectionRouter = Router();

const rejectionController = new RejectionController(
  new RejectionUseCases({ rejectionRepo: new RejectionRepoImpl() })
);

rejectionRouter
  .post(
    "/",
    protect,
    allowedTo([UserRole.ADMIN]),
    createRejectionValidator,
    rejectionController.createRejection
  )
  .put(
    "/:id",
    protect,
    allowedTo([UserRole.ADMIN]),
    updateRejectionValidator,
    rejectionController.updateRejection
  )
  .delete(
    "/:id",
    protect,
    allowedTo([UserRole.ADMIN]),
    deleteRejectionValidator,
    rejectionController.deleteRejection
  )
  .get("/", rejectionController.getAllRejections)
  .get("/:id", getRejectionValidator, rejectionController.getRejectionById);

export default rejectionRouter;