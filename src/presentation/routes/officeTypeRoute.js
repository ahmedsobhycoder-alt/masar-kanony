"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const officeTypeController_1 = require("../controllers/officeTypeController");
const officeTypeUseCases_1 = require("../../domain/usecases/officeTypeUseCases");
const officeTypeValidator_1 = require("../validators/officeTypeValidator");
const officeTypeRepoImpl_1 = __importDefault(require("../../infrastructure/database/repositories/officeTypeRepoImpl"));
const officeTypeRouter = (0, express_1.Router)();
const officeTypeController = new officeTypeController_1.OfficeTypeController(new officeTypeUseCases_1.OfficeTypeUseCases({ officeTypeRepo: officeTypeRepoImpl_1.default }));
officeTypeRouter
    .post("/", officeTypeValidator_1.createOfficeTypeValidator, officeTypeController.createOfficeType)
    .get("/", officeTypeController.getAllOfficeTypes)
    .get("/:id", officeTypeController.getOfficeTypeById);
exports.default = officeTypeRouter;
