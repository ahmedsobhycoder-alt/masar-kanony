"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiError_1 = __importDefault(require("../../../shared/errors/apiError"));
const appConfigModel_1 = __importDefault(require("../models/appConfigModel"));
const courtModel_1 = __importDefault(require("../models/courtModel"));
class AppConfigRepositoryImpl {
    /**
     * Helper to map raw Mongoose lean documents to pure domain entity
     */
    mapToEntity(doc) {
        const { _id, __v, ...rest } = doc;
        return {
            id: _id ? _id.toString() : rest.id,
            ...rest,
        };
    }
    /**
     * Helper to compute dynamic court and governorate statistics in parallel
     */
    async computeLiveStats(fallbackDate) {
        const [courtsCount, uniqueGovernorates, latestCourt] = await Promise.all([
            courtModel_1.default.countDocuments(),
            courtModel_1.default.distinct("governorate", {
                governorate: { $exists: true, $ne: null },
            }),
            courtModel_1.default.findOne().sort({ updatedAt: -1 }).select("updatedAt").lean(),
        ]);
        return {
            courtsCount,
            governoratesCount: uniqueGovernorates.length,
            lastDataUpdate: latestCourt?.updatedAt || fallbackDate || new Date(),
        };
    }
    /**
     * Fetch singleton AppConfig with real-time dynamic statistics
     */
    async getAppConfig() {
        const config = await appConfigModel_1.default.findOne().lean();
        if (!config) {
            throw new apiError_1.default(404, "App config not found");
        }
        const liveStats = await this.computeLiveStats(config.updatedAt);
        return this.mapToEntity({
            ...config,
            stats: liveStats,
        });
    }
    /**
     * Create initial AppConfig singleton document
     */
    async createAppConfig(appConfig) {
        const liveStats = await this.computeLiveStats();
        const createdAppConfig = await appConfigModel_1.default.create({
            ...appConfig,
            stats: liveStats,
        });
        return this.mapToEntity(createdAppConfig.toObject());
    }
    /**
     * Update singleton AppConfig using atomic $set to prevent wiping nested fields
     */
    async updateAppConfig(appConfig) {
        // Exclude 'id' or '_id' from the update payload to avoid immutable field errors
        const { id, ...updateData } = appConfig;
        const updated = await appConfigModel_1.default.findOneAndUpdate({}, // Matches the single configuration document
        { $set: updateData }, {
            new: true,
            upsert: true, // Creates document if it doesn't exist yet
            runValidators: true,
            setDefaultsOnInsert: true,
        }).lean();
        if (!updated) {
            throw new apiError_1.default(404, "App config not found");
        }
        // Return with live computed statistics
        const liveStats = await this.computeLiveStats(updated.updatedAt);
        return this.mapToEntity({
            ...updated,
            stats: liveStats,
        });
    }
}
exports.default = new AppConfigRepositoryImpl();
