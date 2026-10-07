"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const officeModel_1 = __importDefault(require("../models/officeModel"));
const queryBuilder_1 = require("../../../shared/utils/queryBuilder");
class OfficeRepoImpl {
    async countDocuments() {
        return await officeModel_1.default.find().clone().countDocuments();
    }
    async createOffice(officeData) {
        const office = await officeModel_1.default.create(officeData);
        return office;
    }
    async getOffices(query = {}) {
        // 1. Build the base query with filters, sorting, and field limiting
        const queryBuilder = new queryBuilder_1.QueryBuilder(officeModel_1.default, query)
            .filter()
            .sort()
            .limitFields();
        // 2. Clone and count documents matching the applied filters
        const totalDocuments = await queryBuilder.mongooseQuery.clone().countDocuments();
        // 3. Apply pagination using the filtered count
        queryBuilder.paginate(totalDocuments);
        // 4. Execute query with population and .lean() for performance
        const offices = await queryBuilder.mongooseQuery
            .populate([
            { path: "floorId", select: "floorNumber" },
            { path: "courtId", select: "name" },
        ])
            .lean();
        return {
            data: offices || [],
            pagination: queryBuilder.pagination,
        };
    }
    async getOfficeById(id) {
        const office = await officeModel_1.default.findById(id);
        return office;
    }
    async deleteOfficeById(id) {
        const office = await officeModel_1.default.findByIdAndDelete(id);
        return office;
    }
}
const officeRepoImpl = new OfficeRepoImpl();
exports.default = officeRepoImpl;
