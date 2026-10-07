"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courtRepoImpl = void 0;
const courtModel_1 = __importDefault(require("../models/courtModel"));
const queryBuilder_1 = require("../../../shared/utils/queryBuilder");
class CourtRepoImpl {
    async createCourt(courtData) {
        return await courtModel_1.default.create(courtData);
    }
    async getCourts(query = {}) {
        // 1. Build the base query
        const queryBuilder = new queryBuilder_1.QueryBuilder(courtModel_1.default, query)
            .filter()
            .sort()
            .limitFields();
        // 2. Count total documents matching the filters
        const totalCourts = await queryBuilder.mongooseQuery.clone().countDocuments();
        // 3. Apply pagination
        queryBuilder.paginate(totalCourts);
        // 4. Execute query with population and .lean()
        const courts = await queryBuilder.mongooseQuery
            .populate({
            path: "floors",
            select: "-court -_id",
            populate: [
                {
                    path: "offices",
                    select: "officeType roomNumber locationDirection startingWorkingHours endWorkingHours services",
                },
            ],
        })
            .lean();
        return {
            data: courts || [],
            pagination: queryBuilder.pagination,
        };
    }
    async getCourtById(id) {
        return await courtModel_1.default.findByIdAndUpdate(id, {
            $inc: { nViews: 1 },
        }, { new: true }).populate({
            path: "floors",
            populate: [
                { path: "offices", populate: [
                        {
                            path: "officeType",
                            select: "name description-floor-court"
                        }
                    ], },
            ],
        });
    }
    async deleteCourtById(id) {
        return await courtModel_1.default.findByIdAndDelete(id);
    }
    async getMostSeenCourts(query = {}) {
        const queryBuilder = new queryBuilder_1.QueryBuilder(courtModel_1.default.find())
            .filter();
        const totalCourts = await queryBuilder.mongooseQuery.clone().countDocuments();
        queryBuilder.paginate(totalCourts).sort({ nViews: -1 }).limitFields();
        const courts = await queryBuilder.mongooseQuery;
        return courts;
    }
}
exports.courtRepoImpl = new CourtRepoImpl();
