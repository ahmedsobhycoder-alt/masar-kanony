import { Router } from "express";

import { CourtController } from "../controllers/courtController";
import { CourtUseCases } from "../../domain/usecases/courtUseCases";
import { createCourtValidator, getCourtByIdValidator, getCourtsValidator } from "../validators/courtValidator";
import { courtRepoImpl } from "../../infrastructure/database/repositories/courtRepoImpl"; 
const courtRouter = Router();
const courtController = new CourtController(new CourtUseCases({ courtRepo: courtRepoImpl }));
courtRouter.post("/", createCourtValidator, courtController.createCourt)
.get("/mostseen", courtController.getMostSeenCourts).
get("/:id",getCourtByIdValidator ,courtController.getCourtById)
.get("/", getCourtsValidator, courtController.getAllCourts);

export default courtRouter;