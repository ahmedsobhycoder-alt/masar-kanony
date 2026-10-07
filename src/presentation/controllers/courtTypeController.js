"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourtTypeController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const formatJson_1 = require("../../shared/utils/formatJson");
class CourtTypeController {
    courtTypeUseCases;
    constructor(courtTypeUseCases) {
        this.courtTypeUseCases = courtTypeUseCases;
    }
    createCourtType = (0, express_async_handler_1.default)(async (req, res, next) => {
        const courtTypeData = req.body;
        const createdCourtType = await this.courtTypeUseCases.createCourtType(courtTypeData);
        res.status(201).json((0, formatJson_1.formatJson)({
            data: createdCourtType,
            message: req.t("Court type created successfully", { ns: "common" }),
            status: true,
        }));
    });
    getAllCourtTypes = (0, express_async_handler_1.default)(async (req, res, next) => {
        const { data, pagination } = await this.courtTypeUseCases.getCourtTypes(req.query);
        res.status(200).json((0, formatJson_1.formatJson)({
            data: { list: data, paginationResult: pagination },
            message: req.t("Court types fetched successfully", { ns: "common" }),
            status: true,
        }));
    });
    getCourtTypeById = (0, express_async_handler_1.default)(async (req, res, next) => {
        const courtTypeId = req.params.id;
        const courtType = await this.courtTypeUseCases.getCourtTypeById(courtTypeId);
        res.status(200).json((0, formatJson_1.formatJson)({
            data: courtType,
            message: req.t("Court type fetched successfully", { ns: "common" }),
            status: true,
        }));
    });
}
exports.CourtTypeController = CourtTypeController;
