"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const formatJson_1 = require("../../shared/utils/formatJson");
class AppPolicyController {
    appPolicyUseCases;
    constructor(appPolicyUseCases) {
        this.appPolicyUseCases = appPolicyUseCases;
    }
    createAppPolicy = (0, express_async_handler_1.default)(async (req, res, next) => {
        const appPolicyData = req.body;
        appPolicyData.type = req.params.type; // Set the type based on the route parameter
        const createdAppPolicy = await this.appPolicyUseCases.createAppPolicy(appPolicyData);
        res.status(201).json((0, formatJson_1.formatJson)({ data: createdAppPolicy, message: req.t("App policy created successfully", { ns: "common" }), status: true }));
    });
    getAppPolicy = (0, express_async_handler_1.default)(async (req, res, next) => {
        const type = req.params.type || null; // Get the type from the route parameter
        if (type) {
            const appPolicy = await this.appPolicyUseCases.getAppPolicy(type);
            if (!appPolicy) {
                res.status(404).json((0, formatJson_1.formatJson)({ data: null, message: req.t("App policy not found", { ns: "common" }), status: false }));
                return;
            }
            else {
                res.status(200).json((0, formatJson_1.formatJson)({ data: appPolicy, message: req.t("App policy fetched successfully", { ns: "common" }), status: true }));
                return;
            }
        }
        else {
            const appPolicy = await this.appPolicyUseCases.getAppPolicy();
            res.status(200).json((0, formatJson_1.formatJson)({ data: appPolicy, message: req.t("App policy fetched successfully", { ns: "common" }), status: true }));
        }
    });
    updateAppPolicy = (0, express_async_handler_1.default)(async (req, res, next) => {
        const appPolicyData = req.body ?? {};
        const type = req.params.type;
        appPolicyData.type = type; // Ensure the type is set in the appPolicyData
        const updatedAppPolicy = await this.appPolicyUseCases.updateAppPolicy(appPolicyData);
        res.status(200).json((0, formatJson_1.formatJson)({ data: updatedAppPolicy, message: req.t("App policy updated successfully", { ns: "common" }), status: true }));
    });
}
exports.default = AppPolicyController;
