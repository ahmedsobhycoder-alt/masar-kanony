"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloorController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const formatJson_1 = require("../../shared/utils/formatJson");
const printColors_1 = require("../../shared/utils/printColors");
class FloorController {
    floorUseCases;
    constructor(floorUseCases) {
        this.floorUseCases = floorUseCases;
    }
    createFloor = (0, express_async_handler_1.default)(async (req, res, next) => {
        const floorName = req.floorName;
        (0, printColors_1.printGreen)("req.floorName", req.floorName);
        const floorData = { ...req.body, floorName };
        floorData.floorName = floorName;
        (0, printColors_1.printBlue)("floorData", JSON.stringify(floorData));
        const createdFloor = await this.floorUseCases.createFloor(floorData);
        res.status(201).json((0, formatJson_1.formatJson)({ data: createdFloor, message: req.t("Floor created successfully", { ns: "common" }), status: true }));
    });
    getAllFloors = (0, express_async_handler_1.default)(async (req, res, next) => {
        const query = {
            ...req.query,
            ...req.filter
        };
        const { data, pagination } = await this.floorUseCases.getFloors(query);
        res.status(200).json((0, formatJson_1.formatJson)({ data: { list: data, paginationResult: pagination }, message: req.t("Floors fetched successfully", { ns: "common" }), status: true }));
    });
}
exports.FloorController = FloorController;
