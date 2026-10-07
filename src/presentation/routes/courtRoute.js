"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const courtController_1 = require("../controllers/courtController");
const courtUseCases_1 = require("../../domain/usecases/courtUseCases");
const courtValidator_1 = require("../validators/courtValidator");
const courtRepoImpl_1 = require("../../infrastructure/database/repositories/courtRepoImpl");
const courtRouter = (0, express_1.Router)();
const courtController = new courtController_1.CourtController(new courtUseCases_1.CourtUseCases({ courtRepo: courtRepoImpl_1.courtRepoImpl }));
courtRouter.post("/", courtValidator_1.createCourtValidator, courtController.createCourt)
    .get("/mostseen", courtController.getMostSeenCourts).
    get("/:id", courtValidator_1.getCourtByIdValidator, courtController.getCourtById)
    .get("/", courtValidator_1.getCourtsValidator, courtController.getAllCourts);
exports.default = courtRouter;
