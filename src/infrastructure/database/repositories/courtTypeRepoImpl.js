"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourtTypeRepoImpl = void 0;
const courtTypeModel_1 = __importDefault(require("../models/courtTypeModel"));
const queryBuilder_1 = require("../../../shared/utils/queryBuilder");
class CourtTypeRepoImpl {
    async countDocuments() {
        return await courtTypeModel_1.default.find().clone().countDocuments();
    }
    async createCourtType(courtTypeData) {
        return await courtTypeModel_1.default.create(courtTypeData);
    }
    async getCourtTypes(query = {}) {
        // 1. Build the base query with filters, search, sorting, and field limiting
        const queryBuilder = new queryBuilder_1.QueryBuilder(courtTypeModel_1.default, query)
            .filter()
            .sort()
            .limitFields();
        // 2. Clone and count documents matching the filtered/searched criteria
        const totalDocuments = await queryBuilder.mongooseQuery.clone().countDocuments();
        // 3. Apply pagination using the actual matched count
        queryBuilder.paginate(totalDocuments);
        // 4. Execute the query with lean for performance
        const courtTypes = await queryBuilder.mongooseQuery.lean();
        return {
            data: courtTypes || [],
            pagination: queryBuilder.pagination,
        };
    }
    async getCourtTypeById(id) {
        const courtType = await courtTypeModel_1.default.findById(id);
        return courtType ? courtType.toJSON() : null;
    }
    async deleteCourtTypeById(id) {
        const courtType = await courtTypeModel_1.default.findByIdAndDelete(id);
        return courtType ? courtType.toJSON() : null;
    }
}
exports.CourtTypeRepoImpl = CourtTypeRepoImpl;
const courtTypeRepoImpl = new CourtTypeRepoImpl();
exports.default = courtTypeRepoImpl;
