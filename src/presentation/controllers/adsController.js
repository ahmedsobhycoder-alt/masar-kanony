"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdsController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const formatJson_1 = require("../../shared/utils/formatJson");
class AdsController {
    adsUseCases;
    constructor(adsUseCases) {
        this.adsUseCases = adsUseCases;
    }
    createAd = (0, express_async_handler_1.default)(async (req, res, next) => {
        const adData = req.body;
        const createdAd = await this.adsUseCases.createAd(adData);
        res.status(201).json((0, formatJson_1.formatJson)({
            data: createdAd,
            message: req.t("Ad created successfully", { ns: "common" }),
            status: true,
        }));
    });
    getAllAds = (0, express_async_handler_1.default)(async (req, res, next) => {
        const { data, pagination } = await this.adsUseCases.getAds(req.query);
        res.status(200).json((0, formatJson_1.formatJson)({
            data: { list: data, paginationResult: pagination },
            message: req.t("Ads fetched successfully", { ns: "common" }),
            status: true,
        }));
    });
    getAdById = (0, express_async_handler_1.default)(async (req, res, next) => {
        const adId = req.params.id;
        const ad = await this.adsUseCases.getAdById(adId);
        res.status(200).json((0, formatJson_1.formatJson)({
            data: ad,
            message: req.t("Ad fetched successfully", { ns: "common" }),
            status: true,
        }));
    });
    deleteAdById = (0, express_async_handler_1.default)(async (req, res, next) => {
        const adId = req.params.id;
        const deletedAd = await this.adsUseCases.deleteAdById(adId);
        res.status(200).json((0, formatJson_1.formatJson)({
            data: deletedAd,
            message: req.t("Ad deleted successfully", { ns: "common" }),
            status: true,
        }));
    });
}
exports.AdsController = AdsController;
