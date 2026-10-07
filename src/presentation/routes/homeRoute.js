"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const homeController_1 = require("../controllers/homeController");
const homeUseCases_1 = require("../../domain/usecases/homeUseCases");
const homeRepoImpl_1 = __importDefault(require("../../infrastructure/database/repositories/homeRepoImpl"));
const homeRouter = (0, express_1.Router)();
const homeController = new homeController_1.HomeController(new homeUseCases_1.HomeUseCases({ homeRepo: new homeRepoImpl_1.default() }));
homeRouter.get("/", homeController.getHomeData);
exports.default = homeRouter;
