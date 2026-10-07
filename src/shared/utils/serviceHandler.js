"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceHandler = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const apiError_1 = __importDefault(require("../errors/apiError"));
const formatJson_1 = require("../utils/formatJson");
const queryBuilder_1 = require("../utils/queryBuilder");
class ServiceHandler {
    collection;
    modelName;
    searchFields;
    constructor(collection, modelName, searchFields = ["name"]) {
        this.collection = collection;
        this.modelName = modelName;
        this.searchFields = searchFields;
    }
    addOne(populateOptions) {
        return (0, express_async_handler_1.default)(async (req, res, next) => {
            const addedItem = await this.collection.create(req.body);
            if (populateOptions && addedItem) {
                await addedItem.populate(populateOptions);
            }
            if (!addedItem) {
                return next(new apiError_1.default(400, `${this.modelName} not found`));
            }
            res.status(201).json((0, formatJson_1.formatJson)({
                data: addedItem,
                message: req.t("created_successfully", { ns: "common", entity: this.modelName }),
                status: true,
            }));
        });
    }
    getAll(populateOptions) {
        return (0, express_async_handler_1.default)(async (req, res, next) => {
            const filterObject = { ...(req.filterObject || {}), ...(req.query || {}) };
            const queryBuilder = new queryBuilder_1.QueryBuilder(this.collection.find(filterObject), req.query || {})
                .filter()
                .search(this.searchFields);
            const totalDocuments = await this.collection.countDocuments(filterObject);
            queryBuilder.paginate(totalDocuments).sort().limitFields();
            if (populateOptions) {
                queryBuilder.populate(populateOptions);
            }
            const documents = await queryBuilder.mongooseQuery;
            if (!documents) {
                return next(new apiError_1.default(404, `${this.modelName} not found`));
            }
            res.status(200).json((0, formatJson_1.formatJson)({
                data: {
                    count: totalDocuments,
                    paginationResult: queryBuilder.pagination,
                    list: documents,
                },
                message: req.t("fetched_successfully", { ns: "common", entity: this.modelName }),
                status: true,
            }));
        });
    }
    deleteOne(populateOptions) {
        return (0, express_async_handler_1.default)(async (req, res, next) => {
            const id = req.params.id;
            const query = this.collection.findByIdAndDelete(id);
            if (populateOptions) {
                query.populate(populateOptions);
            }
            const deletedItem = await query;
            if (!deletedItem) {
                return next(new apiError_1.default(404, `${this.modelName} not found`));
            }
            res.status(200).json((0, formatJson_1.formatJson)({
                data: deletedItem,
                message: req.t("deleted_successfully", { ns: "common", entity: this.modelName }),
                status: true,
            }));
        });
    }
    updateOne() {
        return (0, express_async_handler_1.default)(async (req, res, next) => {
            const id = req.params.id;
            const updatedItem = await this.collection.findByIdAndUpdate(id, req.body, {
                new: true,
                runValidators: true,
            });
            if (!updatedItem) {
                return next(new apiError_1.default(404, `${this.modelName} not found`));
            }
            res.status(200).json((0, formatJson_1.formatJson)({
                data: updatedItem,
                message: req.t("updated_successfully", { ns: "common", entity: this.modelName }),
                status: true,
            }));
        });
    }
    getOne(populateOptions) {
        return (0, express_async_handler_1.default)(async (req, res, next) => {
            const id = req.params.id;
            const query = this.collection.findById(id);
            if (populateOptions) {
                query.populate(populateOptions);
            }
            const item = await query;
            if (!item) {
                return next(new apiError_1.default(404, `${this.modelName} not found`));
            }
            res.status(200).json((0, formatJson_1.formatJson)({
                data: item,
                message: req.t("fetched_successfully", { ns: "common", entity: this.modelName }),
                status: true,
            }));
        });
    }
}
exports.ServiceHandler = ServiceHandler;
