"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adsController_1 = require("../controllers/adsController");
const adsUseCases_1 = require("../../domain/usecases/adsUseCases");
const adsValidator_1 = require("../validators/adsValidator");
const adsRepoImpl_1 = __importDefault(require("../../infrastructure/database/repositories/adsRepoImpl"));
const imageProcessingMiddleware_1 = __importDefault(require("../middlewares/imageProcessingMiddleware"));
const adsRouter = (0, express_1.Router)();
const adsController = new adsController_1.AdsController(new adsUseCases_1.AdsUseCases({ adsRepo: adsRepoImpl_1.default }));
adsRouter
    .post("/", (0, imageProcessingMiddleware_1.default)("image", "public/uploads/ads"), adsValidator_1.createAdValidator, adsController.createAd)
    .get("/", adsController.getAllAds)
    .get("/:id", adsController.getAdById)
    .delete("/:id", adsValidator_1.deleteByIdValidator, adsController.deleteAdById);
exports.default = adsRouter;
