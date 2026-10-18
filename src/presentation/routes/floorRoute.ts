import { Router } from "express";

import { FloorController } from "../controllers/floorController";
import { FloorUseCases } from "../../domain/usecases/floorUseCases";
import { createFloorValidator, getFloorsValidator, updateFloorValidator } from "../validators/floorValidator";
import { resourceIdValidator, resourceUpdateBodyValidator } from "../validators/adminResourceValidator";
import { protect, allowedTo } from "../middlewares/authMiddleware";
import UserRole from "../../shared/constants/user-roles.enum";
import { floorRepoImpl } from "../../infrastructure/database/repositories/floorRepoImpl";
import  uploadSingleImageAndDoIMageProcessing  from '../middlewares/imageProcessingMiddleware';
import { get } from "node:http";
const floorRouter = Router({ mergeParams: true });
const floorController = new FloorController(new FloorUseCases({ floorRepo: floorRepoImpl }));
floorRouter.post("/", protect, allowedTo([UserRole.ADMIN]), uploadSingleImageAndDoIMageProcessing('image',
    'public/uploads/floors'), createFloorValidator, floorController.createFloor)
    .put("/:id", protect, allowedTo([UserRole.ADMIN]), resourceIdValidator,
        uploadSingleImageAndDoIMageProcessing('image', 'public/uploads/floors'),
        resourceUpdateBodyValidator, updateFloorValidator, floorController.updateFloor)
    .delete("/:id", protect, allowedTo([UserRole.ADMIN]), resourceIdValidator, floorController.deleteFloor)
    .get("/",getFloorsValidator, floorController.getAllFloors);
    
    
    // .get("/:id",getFloorsByCourtIdValidator ,floorController.getAllFloors).get("/", floorController.getAllFloors);
export default floorRouter;
