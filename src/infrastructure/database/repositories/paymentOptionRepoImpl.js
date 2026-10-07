"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const paymentOptionModel_1 = __importDefault(require("../models/paymentOptionModel"));
const queryBuilder_1 = require("../../../shared/utils/queryBuilder");
class PaymentOptionRepoImpl {
    async getPaymentOptions(query = {}) {
        const queryBuilder = new queryBuilder_1.QueryBuilder(paymentOptionModel_1.default.find(), query).filter();
        const totalDocuments = await queryBuilder.mongooseQuery.clone().countDocuments();
        queryBuilder
            .paginate(totalDocuments)
            .sort()
            .limitFields();
        const paymentOptions = await queryBuilder.mongooseQuery;
        return {
            data: paymentOptions,
            pagination: queryBuilder.pagination,
        };
    }
    getPaymentOptionById(id) {
        throw new Error("Method not implemented.");
    }
    createPaymentOption(paymentOptionData) {
        return paymentOptionModel_1.default.create(paymentOptionData);
    }
    updatePaymentOption(id, paymentOptionData) {
        throw new Error("Method not implemented.");
    }
    deletePaymentOptionById(id) {
        throw new Error("Method not implemented.");
    }
}
exports.default = new PaymentOptionRepoImpl();
