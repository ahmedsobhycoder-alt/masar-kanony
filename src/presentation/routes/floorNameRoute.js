"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const floorNameController_1 = require("../controllers/floorNameController");
const floorNameUseCases_1 = require("../../domain/usecases/floorNameUseCases");
const floorNameValidator_1 = require("../validators/floorNameValidator");
const floorNameRepoImpl_1 = __importDefault(require("../../infrastructure/database/repositories/floorNameRepoImpl"));
const floorNameRouter = (0, express_1.Router)();
const floorNameController = new floorNameController_1.FloorNameController(new floorNameUseCases_1.FloorNameUseCases({ floorNameRepo: floorNameRepoImpl_1.default }));
floorNameRouter
    .post("/", floorNameValidator_1.createFloorNameValidator, floorNameController.createFloorName)
    .get("/", floorNameController.getAllFloorNames)
    .get("/:id", floorNameController.getFloorNameById);
exports.default = floorNameRouter;
