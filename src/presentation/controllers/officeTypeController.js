"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfficeTypeController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const formatJson_1 = require("../../shared/utils/formatJson");
class OfficeTypeController {
    officeTypeUseCases;
    constructor(officeTypeUseCases) {
        this.officeTypeUseCases = officeTypeUseCases;
    }
    createOfficeType = (0, express_async_handler_1.default)(async (req, res, next) => {
        const officeTypeData = req.body;
        const createdOfficeType = await this.officeTypeUseCases.createOfficeType(officeTypeData);
        res.status(201).json((0, formatJson_1.formatJson)({
            data: createdOfficeType,
            message: req.t("Office type created successfully", { ns: "common" }),
            status: true,
        }));
    });
    getAllOfficeTypes = (0, express_async_handler_1.default)(async (req, res, next) => {
        const { data, pagination } = await this.officeTypeUseCases.getOfficeTypes(req.query);
        res.status(200).json((0, formatJson_1.formatJson)({
            data: { list: data, paginationResult: pagination },
            message: req.t("Office types fetched successfully", { ns: "common" }),
            status: true,
        }));
    });
    getOfficeTypeById = (0, express_async_handler_1.default)(async (req, res, next) => {
        const officeTypeId = req.params.id;
        const officeType = await this.officeTypeUseCases.getOfficeTypeById(officeTypeId);
        res.status(200).json((0, formatJson_1.formatJson)({
            data: officeType,
            message: req.t("Office type fetched successfully", { ns: "common" }),
            status: true,
        }));
    });
}
exports.OfficeTypeController = OfficeTypeController;
