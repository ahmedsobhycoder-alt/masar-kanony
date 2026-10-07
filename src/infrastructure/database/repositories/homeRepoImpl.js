"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adsModel_1 = __importDefault(require("../models/adsModel"));
const courtModel_1 = __importDefault(require("../models/courtModel"));
const queryBuilder_1 = require("../../../shared/utils/queryBuilder");
class HomeRepoImpl {
    courtQueryBuilder = new queryBuilder_1.QueryBuilder(courtModel_1.default.find());
    adsQueryBuilder = new queryBuilder_1.QueryBuilder(adsModel_1.default.find());
    async getHomeData() {
        // 1. Instantiate FRESH queries locally (Do NOT use 'this.queryBuilder')
        const courtsQueryBuilder = new queryBuilder_1.QueryBuilder(courtModel_1.default, {})
            .populate(["governorate", "courtType", "floors"])
            .limitFields()
            .sort();
        const adsQueryBuilder = new queryBuilder_1.QueryBuilder(adsModel_1.default, {})
            .limitFields()
            .sort();
        const mostSeenQueryBuilder = new queryBuilder_1.QueryBuilder(courtModel_1.default, {})
            .populate(["governorate", "courtType", "floors"])
            .limitFields();
        // 2. Execute all queries simultaneously using Promise.all
        // Always append .clone() to ensure Mongoose treats them as fresh executions
        const [courts, ads, mostSeenCourts] = await Promise.all([
            courtsQueryBuilder.mongooseQuery.clone(),
            adsQueryBuilder.mongooseQuery.clone(),
            // Apply the specific sort directly to the underlying Mongoose query
            mostSeenQueryBuilder.mongooseQuery.clone().sort({ nViews: -1 })
        ]);
        // 3. Return the results
        return { courts, ads, mostSeenCourts };
    }
}
exports.default = HomeRepoImpl;
