"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CityController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const formatJson_1 = require("../../shared/utils/formatJson");
class CityController {
    cityUseCases;
    constructor(cityUseCases) {
        this.cityUseCases = cityUseCases;
    }
    createCity = (0, express_async_handler_1.default)(async (req, res, next) => {
        const cityData = req.body;
        const createdCity = await this.cityUseCases.createCity(cityData);
        res.status(201).json((0, formatJson_1.formatJson)({
            data: createdCity,
            message: req.t("City created successfully", { ns: "common" }),
            status: true
        }));
    });
    getAllCities = (0, express_async_handler_1.default)(async (req, res, next) => {
        const { data, pagination } = await this.cityUseCases.getCities(req.query);
        res.status(200).json((0, formatJson_1.formatJson)({
            data: {
                list: data,
                paginationResult: pagination,
            },
            message: req.t("Cities fetched successfully", { ns: "common" }),
            status: true,
        }));
    });
    getCityById = (0, express_async_handler_1.default)(async (req, res, next) => {
        const cityId = req.params.id;
        const city = await this.cityUseCases.getCityById(cityId);
        res.status(200).json((0, formatJson_1.formatJson)({
            data: city,
            message: req.t("City fetched successfully", { ns: "common" }),
            status: true,
        }));
    });
    deleteCityById = (0, express_async_handler_1.default)(async (req, res, next) => {
        const cityId = req.params.id;
        const deletedCity = await this.cityUseCases.deleteCityById(cityId);
        res.status(200).json((0, formatJson_1.formatJson)({
            data: deletedCity,
            message: req.t("City deleted successfully", { ns: "common" }),
            status: true,
        }));
    });
}
exports.CityController = CityController;
