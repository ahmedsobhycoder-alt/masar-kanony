"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cityController_1 = require("../controllers/cityController");
const cityUseCases_1 = require("../../domain/usecases/cityUseCases");
const cityValidator_1 = require("../validators/cityValidator");
const cityRepoImpl_1 = __importDefault(require("../../infrastructure/database/repositories/cityRepoImpl"));
const cityRouter = (0, express_1.Router)();
const cityController = new cityController_1.CityController(new cityUseCases_1.CityUseCases({ cityRepo: cityRepoImpl_1.default }));
cityRouter
    .post("/", cityValidator_1.createCityValidator, cityController.createCity)
    .get("/", cityController.getAllCities)
    .get("/:id", cityValidator_1.getCityByIdValidator, cityController.getCityById)
    .delete("/:id", cityValidator_1.getCityByIdValidator, cityController.deleteCityById);
exports.default = cityRouter;
