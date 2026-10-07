"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const courtTypeController_1 = require("../controllers/courtTypeController");
const courtTypeUseCases_1 = require("../../domain/usecases/courtTypeUseCases");
const courtTypeValidator_1 = require("../validators/courtTypeValidator");
const courtTypeRepoImpl_1 = __importDefault(require("../../infrastructure/database/repositories/courtTypeRepoImpl"));
const courtTypeRouter = (0, express_1.Router)();
const courtTypeController = new courtTypeController_1.CourtTypeController(new courtTypeUseCases_1.CourtTypeUseCases({ courtTypeRepo: courtTypeRepoImpl_1.default }));
courtTypeRouter
    .post("/", courtTypeValidator_1.createCourtTypeValidator, courtTypeController.createCourtType)
    .get("/", courtTypeController.getAllCourtTypes)
    .get("/:id", courtTypeController.getCourtTypeById);
exports.default = courtTypeRouter;
