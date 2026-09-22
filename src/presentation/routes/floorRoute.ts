import { Router } from "express";

import { FloorController } from "../controllers/floorController";
import { FloorUseCases } from "../../domain/usecases/floorUseCases";
import { createFloorValidator, getFloorsValidator } from "../validators/floorValidator";
import { floorRepoImpl } from "../../infrastructure/database/repositories/floorRepoImpl";
import  uploadSingleImageAndDoIMageProcessing  from '../middlewares/imageProcessingMiddleware';
import { get } from "node:http";
const floorRouter = Router({ mergeParams: true });
const floorController = new FloorController(new FloorUseCases({ floorRepo: floorRepoImpl }));
floorRouter.post("/", uploadSingleImageAndDoIMageProcessing('image',
    'public/uploads/floors'), createFloorValidator, floorController.createFloor)
    .get("/",getFloorsValidator, floorController.getAllFloors);
    
    
    // .get("/:id",getFloorsByCourtIdValidator ,floorController.getAllFloors).get("/", floorController.getAllFloors);
export default floorRouter;