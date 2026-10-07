"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdsRepoImpl = void 0;
const adsModel_1 = __importDefault(require("../models/adsModel"));
const queryBuilder_1 = require("../../../shared/utils/queryBuilder");
class AdsRepoImpl {
    async countDocuments() {
        return await adsModel_1.default.find().clone().countDocuments();
    }
    async createAd(adData) {
        return await adsModel_1.default.create(adData);
    }
    async getAds(query = {}) {
        const queryBuilder = new queryBuilder_1.QueryBuilder(adsModel_1.default, query)
            .filter();
        const totalDocuments = await queryBuilder.mongooseQuery.clone().countDocuments();
        queryBuilder
            .paginate(totalDocuments)
            .sort()
            .limitFields();
        const ads = await queryBuilder.mongooseQuery.lean();
        return {
            data: ads || [],
            pagination: queryBuilder.pagination,
        };
    }
    async getAdById(id) {
        const ad = await adsModel_1.default.findById(id);
        return ad ? ad.toJSON() : null;
    }
    async deleteAdById(id) {
        const ad = await adsModel_1.default.findByIdAndDelete(id);
        return ad ? ad.toJSON() : null;
    }
}
exports.AdsRepoImpl = AdsRepoImpl;
const adsRepoImpl = new AdsRepoImpl();
exports.default = adsRepoImpl;
