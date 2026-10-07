"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourtController = void 0;
const formatJson_1 = require("../../shared/utils/formatJson");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
class CourtController {
    courtUseCases;
    constructor(courtUseCases) {
        this.courtUseCases = courtUseCases;
    }
    createCourt = (0, express_async_handler_1.default)(async (req, res, next) => {
        const courtData = req.courtData;
        const createdCourt = await this.courtUseCases.createCourt(courtData);
        res.status(201).json((0, formatJson_1.formatJson)({ data: createdCourt, message: req.t("Court created successfully", { ns: "common" }), status: true }));
    });
    getAllCourts = (0, express_async_handler_1.default)(async (req, res, next) => {
        const { data, pagination } = await this.courtUseCases.getAllCourts(req.query);
        res.status(200).json((0, formatJson_1.formatJson)({ data: { list: data, paginationResult: pagination }, message: req.t("Courts fetched successfully", { ns: "common" }), status: true }));
    });
    getCourtById = (0, express_async_handler_1.default)(async (req, res, next) => {
        const courtId = req.params.id;
        const court = await this.courtUseCases.getCourtById(courtId);
        res.status(200).json((0, formatJson_1.formatJson)({ data: court, message: req.t("Court fetched successfully", { ns: "common" }), status: true }));
    });
    getMostSeenCourts = (0, express_async_handler_1.default)(async (req, res, next) => {
        const courts = await this.courtUseCases.getMostSeenCourts(req.query);
        res.status(200).json((0, formatJson_1.formatJson)({ data: courts, message: req.t("Courts fetched successfully", { ns: "common" }), status: true }));
    });
}
exports.CourtController = CourtController;
