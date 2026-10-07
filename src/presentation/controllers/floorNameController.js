"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloorNameController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const formatJson_1 = require("../../shared/utils/formatJson");
class FloorNameController {
    floorNameUseCases;
    constructor(floorNameUseCases) {
        this.floorNameUseCases = floorNameUseCases;
    }
    createFloorName = (0, express_async_handler_1.default)(async (req, res, next) => {
        const floorNameData = req.body;
        const createdFloorName = await this.floorNameUseCases.createFloorName(floorNameData);
        res.status(201).json((0, formatJson_1.formatJson)({
            data: createdFloorName,
            message: req.t("Floor name created successfully", { ns: "common" }),
            status: true,
        }));
    });
    getAllFloorNames = (0, express_async_handler_1.default)(async (req, res, next) => {
        const { data, pagination } = await this.floorNameUseCases.getFloorNames(req.query);
        res.status(200).json((0, formatJson_1.formatJson)({
            data: { list: data, paginationResult: pagination },
            message: req.t("Floor names fetched successfully", { ns: "common" }),
            status: true,
        }));
    });
    getFloorNameById = (0, express_async_handler_1.default)(async (req, res, next) => {
        const floorNameId = req.params.id;
        const floorName = await this.floorNameUseCases.getFloorNameById(floorNameId);
        res.status(200).json((0, formatJson_1.formatJson)({
            data: floorName,
            message: req.t("Floor name fetched successfully", { ns: "common" }),
            status: true,
        }));
    });
}
exports.FloorNameController = FloorNameController;
