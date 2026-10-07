"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const governorateController_1 = require("../controllers/governorateController");
const governorateUseCases_1 = require("../../domain/usecases/governorateUseCases");
const governorateValidator_1 = require("../validators/governorateValidator");
const governorateRepoImpl_1 = __importDefault(require("../../infrastructure/database/repositories/governorateRepoImpl"));
const governorateRouter = (0, express_1.Router)();
const governorateController = new governorateController_1.GovernorateController(new governorateUseCases_1.GovernorateUseCases({ governorateRepo: governorateRepoImpl_1.default }));
governorateRouter
    .post("/", governorateValidator_1.createGovernorateValidator, governorateController.createGovernorate)
    .get("/", governorateController.getAllGovernorates)
    .get("/:id", governorateController.getGovernorateById);
exports.default = governorateRouter;
