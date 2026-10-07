"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.floorRepoImpl = void 0;
const floorModel_1 = __importDefault(require("../models/floorModel"));
const queryBuilder_1 = require("../../../shared/utils/queryBuilder");
class FloorRepoImpl {
    async countDocuments() {
        return await floorModel_1.default.find().clone().countDocuments();
    }
    async createFloor(floorData) {
        const floor = await floorModel_1.default.create(floorData);
        return await floor.populate(["offices"]);
    }
    async getFloors(query = {}) {
        // 1. Build the base query with filters, sorting, and field limiting
        const queryBuilder = new queryBuilder_1.QueryBuilder(floorModel_1.default, query)
            .filter()
            .sort()
            .limitFields();
        // 2. Clone and count documents matching the applied filters
        const totalDocuments = await queryBuilder.mongooseQuery.clone().countDocuments();
        // 3. Apply pagination using the filtered count
        queryBuilder.paginate(totalDocuments);
        // 4. Execute query with population and .lean() for performance
        const floors = await queryBuilder.mongooseQuery
            .populate(["offices", { path: "court" }])
            .lean();
        return {
            data: floors || [],
            pagination: queryBuilder.pagination,
        };
    }
    async getFloorById(id) {
        const floor = await floorModel_1.default.findById(id);
        return floor ? floor.toJSON() : null;
    }
    async getFloorsByCourtId(court) {
        const floors = await floorModel_1.default.find({ where: { court } });
        return floors.length ? floors.map((floor) => floor.toJSON()) : null;
    }
    async deleteFloorById(id) {
        const floor = await floorModel_1.default.findById(id);
        if (!floor) {
            return null;
        }
        return floor.toJSON();
    }
}
exports.floorRepoImpl = new FloorRepoImpl();
