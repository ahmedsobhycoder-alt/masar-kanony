"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GovernorateRepoImpl = void 0;
const governorateModel_1 = __importDefault(require("../models/governorateModel"));
const queryBuilder_1 = require("../../../shared/utils/queryBuilder");
const baseRepository_1 = __importDefault(require("./baseRepository"));
class GovernorateRepoImpl extends baseRepository_1.default {
    constructor() {
        // Pass the GovernorateModel up to the BaseRepository
        super(governorateModel_1.default);
    }
    async createGovernorate(governorateData) {
        return await governorateModel_1.default.create(governorateData);
    }
    async getGovernorates(query) {
        // 1. Build base query with filter, sort, and field limits
        const queryBuilder = new queryBuilder_1.QueryBuilder(governorateModel_1.default, query)
            .filter()
            .sort()
            .limitFields();
        // 2. Clone and count documents matching the applied filters
        const totalDocuments = await queryBuilder.mongooseQuery.clone().countDocuments();
        // 3. Apply pagination using the filtered count
        queryBuilder.paginate(totalDocuments);
        // 4. Execute query with .lean() for performance
        const governorates = await queryBuilder.mongooseQuery.lean();
        return {
            data: governorates || [],
            pagination: queryBuilder.pagination,
        };
    }
    async getGovernorateById(id) {
        const governorate = await governorateModel_1.default.findById(id).lean();
        return governorate ? governorate : null;
    }
    async deleteGovernorateById(id) {
        const governorate = await governorateModel_1.default.findByIdAndDelete(id);
        return governorate ? governorate.toJSON() : null;
    }
}
exports.GovernorateRepoImpl = GovernorateRepoImpl;
const governorateRepoImpl = new GovernorateRepoImpl();
exports.default = governorateRepoImpl;
