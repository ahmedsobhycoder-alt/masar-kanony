import PaymentEntity from "../../../domain/entities/paymentEntity";
import PaymentRepo from "../../../domain/repositories/paymentRepo";
import PaymentModel from "../models/paymentModel";
import { QueryBuilder } from "../../../shared/utils/queryBuilder";
import listType from "../../../shared/constants/types";
import { throwError } from "../../../shared/utils/helpers";
import PaymentStatus from "../../../shared/constants/payment-status.enums";
import UserModel from "../models/userModel";
import UserEntity from "../../../domain/entities/userEntity";
import mongoose from "mongoose";
class PaymentRepoImpl implements PaymentRepo {
    async approvePayment(id: string): Promise<PaymentEntity> {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const payment = await PaymentModel.findById(id).session(session);
            if (!payment) {
                return throwError(404, "Payment not found");
            }

            if (payment.paymentStatus === PaymentStatus.APPROVED) {
                return throwError(400, "Payment is already approved");
            }

            const user = await UserModel.findById(payment.user).session(session);
            if (!user) {
                return throwError(404, "User not found");
            }

            user.isSubscribed = true;
            await user.save({ session });

            payment.paymentStatus = PaymentStatus.APPROVED;
            await payment.save({ session });

            await session.commitTransaction();
            return payment.toObject() as PaymentEntity;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
    async declinePayment(id: string): Promise<PaymentEntity> {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const payment = await PaymentModel.findById(id).session(session);
            if (!payment) {
                return throwError(404, "Payment not found");
            }

            if (payment.paymentStatus === PaymentStatus.REJECTED) {
                return throwError(400, "Payment is already declined");
            }

            const user = await UserModel.findById(payment.user).session(session);
            if (!user) {
                return throwError(404, "User not found");
            }

            user.isSubscribed = false;
            await user.save({ session });

            payment.paymentStatus = PaymentStatus.REJECTED;
            await payment.save({ session });

            await session.commitTransaction();
            return payment.toObject() as PaymentEntity;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
    async getPayments(
        query: Record<string, any> = {}
    ): Promise<listType<PaymentEntity>> {
        return await new QueryBuilder<PaymentEntity>(PaymentModel, query)
            .filter()
            .sort()
            .limitFields()
            .paginate()
            .execute();
    }

    createPayment(paymentData: PaymentEntity): Promise<PaymentEntity> {
        return PaymentModel.create(paymentData);
    }

    getPaymentById(id: string): Promise<PaymentEntity | null> {
        return PaymentModel.findById(id);
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


    updatePaymentStatus(id: string, status: string): Promise<PaymentEntity | null> {
        return PaymentModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
    }

    deletePaymentById(id: string): Promise<PaymentEntity | null> {
        return PaymentModel.findByIdAndDelete(id);
    }

    countDocuments(): Promise<number> {
        return PaymentModel.countDocuments();
    }
}

export default new PaymentRepoImpl();