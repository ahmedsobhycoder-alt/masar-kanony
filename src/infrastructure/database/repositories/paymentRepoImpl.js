"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const paymentModel_1 = __importDefault(require("../models/paymentModel"));
const queryBuilder_1 = require("../../../shared/utils/queryBuilder");
const apiError_1 = __importDefault(require("../../../shared/errors/apiError"));
const payment_status_enums_1 = __importDefault(require("../../../shared/constants/payment-status.enums"));
const userModel_1 = __importDefault(require("../models/userModel"));
const mongoose_1 = __importDefault(require("mongoose"));
class PaymentRepoImpl {
    async approvePayment(id) {
        const session = await mongoose_1.default.startSession();
        session.startTransaction();
        try {
            const payment = await paymentModel_1.default.findById(id).session(session);
            if (!payment) {
                throw new apiError_1.default(404, "Payment not found");
            }
            if (payment.status === payment_status_enums_1.default.PAID) {
                throw new apiError_1.default(400, "Payment is already approved");
            }
            const user = await userModel_1.default.findById(payment.user).session(session);
            if (!user) {
                throw new apiError_1.default(404, "User not found");
            }
            user.isSubscribed = true;
            await user.save({ session });
            payment.status = payment_status_enums_1.default.PAID;
            await payment.save({ session });
            await session.commitTransaction();
            return payment.toObject();
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    async declinePayment(id) {
        const session = await mongoose_1.default.startSession();
        session.startTransaction();
        try {
            const payment = await paymentModel_1.default.findById(id).session(session);
            if (!payment) {
                throw new apiError_1.default(404, "Payment not found");
            }
            if (payment.status === payment_status_enums_1.default.CANCELED) {
                throw new apiError_1.default(400, "Payment is already declined");
            }
            const user = await userModel_1.default.findById(payment.user).session(session);
            if (!user) {
                throw new apiError_1.default(404, "User not found");
            }
            user.isSubscribed = false;
            await user.save({ session });
            payment.status = payment_status_enums_1.default.CANCELED;
            await payment.save({ session });
            await session.commitTransaction();
            return payment.toObject();
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    async getPayments(query = {}) {
        const queryBuilder = new queryBuilder_1.QueryBuilder(paymentModel_1.default, query).filter();
        const totalDocuments = await queryBuilder.mongooseQuery.clone().countDocuments();
        queryBuilder
            .paginate(totalDocuments)
            .sort()
            .limitFields();
        const payments = await queryBuilder.mongooseQuery.lean();
        return {
            data: payments || [],
            pagination: queryBuilder.pagination,
        };
    }
    createPayment(paymentData) {
        return paymentModel_1.default.create(paymentData);
    }
    getPaymentById(id) {
        return paymentModel_1.default.findById(id);
    }
    getPaymentByTransactionId(transactionId) {
        return paymentModel_1.default.findOne({ transactionId });
    }
    updatePaymentStatus(id, status) {
        return paymentModel_1.default.findByIdAndUpdate(id, { status }, { new: true });
    }
    deletePaymentById(id) {
        return paymentModel_1.default.findByIdAndDelete(id);
    }
    countDocuments() {
        return paymentModel_1.default.countDocuments();
    }
}
exports.default = new PaymentRepoImpl();
