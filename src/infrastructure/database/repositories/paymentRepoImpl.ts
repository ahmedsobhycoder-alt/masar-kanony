import PaymentEntity from "../../../domain/entities/paymentEntity";
import PaymentRepo from "../../../domain/repositories/paymentRepo";
import PaymentModel from "../models/paymentModel";
import { QueryBuilder } from "../../../shared/utils/queryBuilder";
import listType from "../../../shared/constants/types";
import { throwError } from "../../../shared/utils/helpers";
import PaymentStatus, { SubscriptionStatus } from "../../../shared/constants/payment-status.enums";
import UserModel from "../models/userModel";
import UserEntity from "../../../domain/entities/userEntity";
import mongoose from "mongoose";
class PaymentRepoImpl implements PaymentRepo {
    private async reviewPayment(id: string, status: PaymentStatus, reviewerId?: string, reason?: string, message?: string): Promise<PaymentEntity> {
        const session = await mongoose.startSession();
        try {
            return await session.withTransaction(async () => {
                const payment = await PaymentModel.findById(id).session(session);
                if (!payment) return throwError(404, "Payment not found");
                if (payment.paymentStatus !== PaymentStatus.PENDING) return throwError(409, "Payment has already been reviewed");
                const user = await UserModel.findById(payment.user).session(session);
                if (!user) return throwError(404, "User not found");
                if (status === PaymentStatus.APPROVED) {
                    user.isSubscribed = true;
                    user.currentsubscriptionStatus = SubscriptionStatus.ACTIVE;
                    user.currentSubscriptionId = payment._id.toString();
                } else if (!user.isSubscribed) {
                    user.currentsubscriptionStatus = SubscriptionStatus.INACTIVE;
                }
                await user.save({ session });
                payment.paymentStatus = status;
                payment.reviewedAt = new Date();
                if (reviewerId) payment.reviewedByAdminId = new mongoose.Types.ObjectId(reviewerId);
                payment.rejectionReason = status === PaymentStatus.REJECTED ? reason || null : null;
                payment.rejectionMessage = status === PaymentStatus.REJECTED ? message || null : null;
                await payment.save({ session });
                return payment.toObject() as PaymentEntity;
            });
        } finally {
            await session.endSession();
        }
    }
    approvePayment(id: string, reviewerId?: string): Promise<PaymentEntity> {
        return this.reviewPayment(id, PaymentStatus.APPROVED, reviewerId);
    }
    declinePayment(id: string, reviewerId?: string, reason?: string, message?: string): Promise<PaymentEntity> {
        return this.reviewPayment(id, PaymentStatus.REJECTED, reviewerId, reason, message);
    }
    async getPayments(
        query: Record<string, any> = {}
    ): Promise<listType<PaymentEntity>> {
        const { status, ...filters } = query;
        if (status) filters.paymentStatus = status;
        return await new QueryBuilder<PaymentEntity>(PaymentModel, filters)
            .filter()
            .sort()
            .limitFields()
            .populate({ path: "user", model: UserModel, select: "name email phone active role isSubscribed verified" })
            .paginate()
            .execute();
    }

    createPayment(paymentData: PaymentEntity): Promise<PaymentEntity> {
        return PaymentModel.create(paymentData);
    }

    getPaymentById(id: string): Promise<PaymentEntity | null> {
        return PaymentModel.findById(id)
            .populate({ path: "user", model: UserModel, select: "name email phone active role verified isSubscribed currentsubscriptionStatus currentSubscriptionId profileImage createdAt updatedAt" })
            .populate({ path: "reviewedByAdminId", model: UserModel, select: "name email" });
    }

    getPaymentByTransactionId(transactionId: string): Promise<PaymentEntity | null> {
        return PaymentModel.findOne({ transactionId });
    }

    async getPaymentStatus(id: string): Promise<PaymentEntity | null> {
        const payment = await PaymentModel.findOne(
           { user : id  }
        ).select("-reviewedByAdminId").lean<PaymentEntity>();
        return payment;
    }


    updatePaymentStatus(id: string, status: string, reviewerId?: string, reason?: string, message?: string): Promise<PaymentEntity | null> {
        if (status === PaymentStatus.APPROVED) return this.approvePayment(id, reviewerId);
        if (status === PaymentStatus.REJECTED) return this.declinePayment(id, reviewerId, reason, message);
        return throwError(400, "Only approval or rejection is allowed");
    }

    deletePaymentById(id: string): Promise<PaymentEntity | null> {
        return PaymentModel.findByIdAndDelete(id);
    }

    countDocuments(): Promise<number> {
        return PaymentModel.countDocuments();
    }
}

export default new PaymentRepoImpl();
