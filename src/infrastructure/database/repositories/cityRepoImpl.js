"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CityRepoImpl = void 0;
const cityModel_1 = __importDefault(require("../models/cityModel"));
const queryBuilder_1 = require("../../../shared/utils/queryBuilder");
const baseRepository_1 = __importDefault(require("./baseRepository"));
class CityRepoImpl extends baseRepository_1.default {
    constructor() {
        super(cityModel_1.default);
    }
    async createCity(cityData) {
        return await cityModel_1.default.create(cityData);
    }
    async getCities(query) {
        const queryBuilder = new queryBuilder_1.QueryBuilder(cityModel_1.default, query)
            .filter()
            .sort()
            .limitFields();
        // Clone to count documents matching the filtered criteria
        const totalDocuments = await queryBuilder.mongooseQuery.clone().countDocuments();
        // Apply skip & limit pagination logic
        queryBuilder.paginate(totalDocuments);
        // Execute query with lean for read performance
        const cities = await queryBuilder.mongooseQuery.lean();
        return {
            data: cities || [],
            pagination: queryBuilder.pagination,
        };
    }
    async getCityById(id) {
        const city = await cityModel_1.default.findById(id).populate("governorate").lean();
        return city ? city : null;
    }
    async deleteCityById(id) {
        const city = await cityModel_1.default.findByIdAndDelete(id);
        return city ? city.toJSON() : null;
    }
}
exports.CityRepoImpl = CityRepoImpl;
const cityRepoImpl = new CityRepoImpl();
exports.default = cityRepoImpl;
