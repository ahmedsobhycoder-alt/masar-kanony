"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfficeTypeRepoImpl = void 0;
const officeTypeModel_1 = __importDefault(require("../models/officeTypeModel"));
const queryBuilder_1 = require("../../../shared/utils/queryBuilder");
class OfficeTypeRepoImpl {
    async createOfficeType(officeTypeData) {
        return await officeTypeModel_1.default.create(officeTypeData);
    }
    async getOfficeTypes(query = {}) {
        // 1. Build base query with filter, search, sort, and field limits
        const queryBuilder = new queryBuilder_1.QueryBuilder(officeTypeModel_1.default, query)
            .filter()
            .sort()
            .limitFields();
        // 2. Clone and count documents matching the filtered/searched criteria
        const totalDocuments = await queryBuilder.mongooseQuery.clone().countDocuments();
        // 3. Apply pagination using the filtered count
        queryBuilder.paginate(totalDocuments);
        // 4. Execute query with .lean() for performance and plain objects
        const officeTypes = await queryBuilder.mongooseQuery.lean();
        return {
            data: officeTypes || [],
            pagination: queryBuilder.pagination,
        };
    }
    async getOfficeTypeById(id) {
        const officeType = await officeTypeModel_1.default.findById(id);
        return officeType ? officeType.toJSON() : null;
    }
    async deleteOfficeTypeById(id) {
        const officeType = await officeTypeModel_1.default.findByIdAndDelete(id);
        return officeType ? officeType.toJSON() : null;
    }
}
exports.OfficeTypeRepoImpl = OfficeTypeRepoImpl;
const officeTypeRepoImpl = new OfficeTypeRepoImpl();
exports.default = officeTypeRepoImpl;
