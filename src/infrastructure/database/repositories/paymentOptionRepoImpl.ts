import PaymentOptionEntity from "../../../domain/entities/paymentOption";
import PaymentOptionRepo from "../../../domain/repositories/paymentOptionRepo";
import PaymentOptionModel from "../models/paymentOptionModel";
import { QueryBuilder, QueryPagination } from "../../../shared/utils/queryBuilder";
import { printGreen } from "../../../shared/utils/printColors";

class PaymentOptionRepoImpl implements PaymentOptionRepo {
    async getPaymentOptions(query: Record<string, any> = {}): Promise<{ data: PaymentOptionEntity[]; pagination?: QueryPagination }> {
        const queryBuilder = new QueryBuilder<PaymentOptionEntity>(PaymentOptionModel.find(), query).filter();
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
    getPaymentOptionById(id: string): Promise<PaymentOptionEntity | null> {
        throw new Error("Method not implemented.");
    }
    createPaymentOption(paymentOptionData: PaymentOptionEntity): Promise<PaymentOptionEntity> {
        return PaymentOptionModel.create(paymentOptionData);
    }
    updatePaymentOption(id: string, paymentOptionData: PaymentOptionEntity): Promise<PaymentOptionEntity | null> {
        throw new Error("Method not implemented.");
    }
    deletePaymentOptionById(id: string): Promise<PaymentOptionEntity | null> {
        throw new Error("Method not implemented.");
    }

}
export default new PaymentOptionRepoImpl();