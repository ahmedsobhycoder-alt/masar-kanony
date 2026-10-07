"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloorNameRepoImpl = void 0;
const floorNameModel_1 = __importDefault(require("../models/floorNameModel"));
const queryBuilder_1 = require("../../../shared/utils/queryBuilder");
class FloorNameRepoImpl {
    async countDocuments() {
        return await floorNameModel_1.default.find().clone().countDocuments();
    }
    async createFloorName(floorNameData) {
        return await floorNameModel_1.default.create(floorNameData);
    }
    async getFloorNames(query = {}) {
        // 1. Build base query with filter, sort, and field limits
        const queryBuilder = new queryBuilder_1.QueryBuilder(floorNameModel_1.default, query)
            .filter()
            .sort()
            .limitFields();
        // 2. Clone and count documents matching the applied filters
        const totalDocuments = await queryBuilder.mongooseQuery.clone().countDocuments();
        // 3. Apply pagination using the filtered count
        queryBuilder.paginate(totalDocuments);
        // 4. Execute query with .lean() for plain objects
        const floorNames = await queryBuilder.mongooseQuery.lean();
        return {
            data: floorNames || [],
            pagination: queryBuilder.pagination,
        };
    }
    async getFloorNameById(id) {
        const floorName = await floorNameModel_1.default.findById(id);
        return floorName ? floorName.toJSON() : null;
    }
    async deleteFloorNameById(id) {
        const floorName = await floorNameModel_1.default.findByIdAndDelete(id);
        return floorName ? floorName.toJSON() : null;
    }
}
exports.FloorNameRepoImpl = FloorNameRepoImpl;
const floorNameRepoImpl = new FloorNameRepoImpl();
exports.default = floorNameRepoImpl;
