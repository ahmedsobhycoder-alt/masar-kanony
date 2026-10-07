"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const floorController_1 = require("../controllers/floorController");
const floorUseCases_1 = require("../../domain/usecases/floorUseCases");
const floorValidator_1 = require("../validators/floorValidator");
const floorRepoImpl_1 = require("../../infrastructure/database/repositories/floorRepoImpl");
const imageProcessingMiddleware_1 = __importDefault(require("../middlewares/imageProcessingMiddleware"));
const floorRouter = (0, express_1.Router)({ mergeParams: true });
const floorController = new floorController_1.FloorController(new floorUseCases_1.FloorUseCases({ floorRepo: floorRepoImpl_1.floorRepoImpl }));
floorRouter.post("/", (0, imageProcessingMiddleware_1.default)('image', 'public/uploads/floors'), floorValidator_1.createFloorValidator, floorController.createFloor)
    .get("/", floorValidator_1.getFloorsValidator, floorController.getAllFloors);
// .get("/:id",getFloorsByCourtIdValidator ,floorController.getAllFloors).get("/", floorController.getAllFloors);
exports.default = floorRouter;
