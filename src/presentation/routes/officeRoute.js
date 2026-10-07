"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const officesController_1 = __importDefault(require("../controllers/officesController"));
const officeUseCases_1 = __importDefault(require("../../domain/usecases/officeUseCases"));
const officeValidator_1 = require("../validators/officeValidator");
const officeRepoImpl_1 = __importDefault(require("../../infrastructure/database/repositories/officeRepoImpl"));
const officeRouter = (0, express_1.Router)();
const officeController = new officesController_1.default({
    officeUseCases: new officeUseCases_1.default({ officeRepo: officeRepoImpl_1.default }),
});
officeRouter
    .post("/", officeValidator_1.createOfficeValidator, officeController.createOffice)
    .get("/", officeController.getOffices);
exports.default = officeRouter;
