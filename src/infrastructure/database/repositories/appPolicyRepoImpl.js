"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appPolicyModel_1 = __importDefault(require("../models/appPolicyModel"));
class AppPolicyRepoImpl {
    async createAppPolicy(appPolicy) {
        const newAppPolicy = await appPolicyModel_1.default.create(appPolicy);
        return newAppPolicy;
    }
    async getAppPolicy(type) {
        const appPolicy = await appPolicyModel_1.default.findOne(type ? { type } : {});
        return appPolicy;
    }
    async updateAppPolicy(appPolicy) {
        const { type, ...updateData } = appPolicy;
        const updatedDoc = await appPolicyModel_1.default.findOneAndUpdate({ type }, {
            $set: {
                ...updateData,
                lastUpdate: new Date(), // Automatically refreshes update date
            },
        }, {
            new: true, // Returns the modified document rather than the original
            upsert: true, // Creates the document if it doesn't exist
            runValidators: true, // Ensures schema validation rules run on update
            setDefaultsOnInsert: true, // Applies default schema values if created
        }).lean();
        return this.mapToEntity(updatedDoc);
    }
    mapToEntity(doc) {
        const { _id, __v, ...rest } = doc;
        return {
            id: _id ? _id.toString() : rest.id,
            ...rest,
        };
    }
}
exports.default = new AppPolicyRepoImpl();
