"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepoImpl = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const queryBuilder_1 = require("../../../shared/utils/queryBuilder");
class UserRepoImpl {
    async countDocuments() {
        return await userModel_1.default.find().clone().countDocuments();
    }
    async getUsers(query = {}) {
        const queryBuilder = new queryBuilder_1.QueryBuilder(userModel_1.default, query)
            .filter();
        const totalDocuments = await queryBuilder.mongooseQuery.clone().countDocuments();
        queryBuilder
            .paginate(totalDocuments)
            .sort()
            .limitFields();
        const users = await queryBuilder.mongooseQuery.lean();
        return {
            data: users || [],
            pagination: queryBuilder.pagination,
        };
    }
    async getUserById(id) {
        const user = await userModel_1.default.findById(id).select("-password").lean();
        return user ? user : null;
    }
    async deleteUserById(id) {
        const user = await userModel_1.default.findByIdAndDelete(id).select("-password");
        return user ? user.toJSON() : null;
    }
}
exports.UserRepoImpl = UserRepoImpl;
const userRepoImpl = new UserRepoImpl();
exports.default = userRepoImpl;
