import { Router } from "express";
const courtAndOfficeRouter = Router();
import CourtAndOfficeController from "../controllers/courtAndOfficeController";
import CourtAndOfficeUseCases from "src/domain/usecases/courtAndOfficeUseCases";
import courtAndOfficeRepoImpl from "../../infrastructure/database/repositories/courtAndOfficeRepoImpl";
import { protect } from "../middlewares/authMiddleware";
const courtAndOfficeController = new CourtAndOfficeController(
    new CourtAndOfficeUseCases({ courtAndOfficeRepo: courtAndOfficeRepoImpl })
);
courtAndOfficeRouter.get("/", courtAndOfficeController.getCourtsAndOffices);
export default courtAndOfficeRouter;