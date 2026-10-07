"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GovernorateController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const formatJson_1 = require("../../shared/utils/formatJson");
class GovernorateController {
    governorateUseCases;
    constructor(governorateUseCases) {
        this.governorateUseCases = governorateUseCases;
    }
    createGovernorate = (0, express_async_handler_1.default)(async (req, res, next) => {
        const governorateData = req.body;
        const createdGovernorate = await this.governorateUseCases.createGovernorate(governorateData);
        res.status(201).json((0, formatJson_1.formatJson)({
            data: createdGovernorate,
            message: req.t("Governorate created successfully", { ns: "common" }),
            status: true,
        }));
    });
    getAllGovernorates = (0, express_async_handler_1.default)(async (req, res, next) => {
        const { data, pagination } = await this.governorateUseCases.getGovernorates(req.query);
        res.status(200).json((0, formatJson_1.formatJson)({
            data: {
                list: data,
                paginationResult: pagination,
            },
            message: req.t("Governorates fetched successfully", { ns: "common" }),
            status: true,
        }));
    });
    getGovernorateById = (0, express_async_handler_1.default)(async (req, res, next) => {
        const governorateId = req.params.id;
        const governorate = await this.governorateUseCases.getGovernorateById(governorateId);
        res.status(200).json((0, formatJson_1.formatJson)({
            data: governorate,
            message: req.t("Governorate fetched successfully", { ns: "common" }),
            status: true,
        }));
    });
}
exports.GovernorateController = GovernorateController;
