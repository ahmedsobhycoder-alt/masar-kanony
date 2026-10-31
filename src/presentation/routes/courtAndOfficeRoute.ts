import { Router } from "express";
const courtAndOfficeRouter = Router();
import CourtAndOfficeController from "../controllers/courtAndOfficeController";
import CourtAndOfficeUseCases from "../../domain/usecases/courtAndOfficeUseCases";
import courtAndOfficeRepoImpl from "../../infrastructure/database/repositories/courtAndOfficeRepoImpl";
import { optionalProtect, protect } from "../middlewares/authMiddleware";
const courtAndOfficeController = new CourtAndOfficeController(
    new CourtAndOfficeUseCases({ courtAndOfficeRepo: courtAndOfficeRepoImpl })
);
courtAndOfficeRouter.get("/",optionalProtect, courtAndOfficeController.getCourtsAndOffices);
export default courtAndOfficeRouter;
