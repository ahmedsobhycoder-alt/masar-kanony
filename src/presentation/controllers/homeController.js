"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const formatJson_1 = require("../../shared/utils/formatJson");
class HomeController {
    homeUseCases;
    constructor(homeUseCases) {
        this.homeUseCases = homeUseCases;
    }
    getHomeData = (0, express_async_handler_1.default)(async (req, res, next) => {
        const homeData = await this.homeUseCases.getHomeData();
        res.status(200).json((0, formatJson_1.formatJson)({
            data: {
                "ads": homeData.ads,
                "courts": homeData.courts,
                "mostSeenCourts": homeData.mostSeenCourts
            },
            message: req.t("Home data fetched successfully", { ns: "common" }),
            status: true,
        }));
    });
}
exports.HomeController = HomeController;
