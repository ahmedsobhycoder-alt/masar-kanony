"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const formatJson_1 = require("../../shared/utils/formatJson");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
class AppConfigController {
    appConfigUseCases;
    constructor(appConfigUseCases) {
        this.appConfigUseCases = appConfigUseCases;
    }
    getAppConfig = (0, express_async_handler_1.default)(async (req, res, next) => {
        const appConfig = await this.appConfigUseCases.getAppConfig();
        res.status(200).json((0, formatJson_1.formatJson)({ data: appConfig, message: req.t("App config fetched successfully", { ns: "common" }), status: true }));
    });
    createAppConfig = (0, express_async_handler_1.default)(async (req, res, next) => {
        const appConfigData = req.body;
        const createdAppConfig = await this.appConfigUseCases.createAppConfig(appConfigData);
        res.status(201).json((0, formatJson_1.formatJson)({ data: createdAppConfig, message: req.t("App config created successfully", { ns: "common" }), status: true }));
    });
    updateAppConfig = (0, express_async_handler_1.default)(async (req, res, next) => {
        const appConfigData = req.body;
        const updatedAppConfig = await this.appConfigUseCases.updateAppConfig(appConfigData);
        res.status(200).json((0, formatJson_1.formatJson)({
            data: updatedAppConfig,
            message: req.t("App config updated successfully", { ns: "common" }),
            status: true,
        }));
    });
}
exports.default = AppConfigController;
