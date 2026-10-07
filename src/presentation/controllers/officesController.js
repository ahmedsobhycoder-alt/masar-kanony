"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const formatJson_1 = require("../../shared/utils/formatJson");
class OfficesController {
    officeUseCases;
    constructor({ officeUseCases }) {
        this.officeUseCases = officeUseCases;
    }
    createOffice = (0, express_async_handler_1.default)(async (req, res, next) => {
        const officeData = req.body;
        const createdOffice = await this.officeUseCases.createOffice(officeData);
        res.status(201).json((0, formatJson_1.formatJson)({ data: createdOffice, message: req.t("Office created successfully", { ns: "common" }), status: true }));
    });
    getOffices = (0, express_async_handler_1.default)(async (req, res, next) => {
        const { data, pagination } = await this.officeUseCases.getOffices(req.query);
        res.status(200).json((0, formatJson_1.formatJson)({ data: { list: data, paginationResult: pagination }, message: req.t("Offices fetched successfully", { ns: "common" }), status: true }));
    });
}
exports.default = OfficesController;
