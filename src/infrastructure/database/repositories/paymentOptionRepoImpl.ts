import PaymentOptionEntity from "../../../domain/entities/paymentOption";
import PaymentOptionRepo from "../../../domain/repositories/paymentOptionRepo";
import PaymentOptionModel from "../models/paymentOptionModel";
import { QueryBuilder } from "../../../shared/utils/queryBuilder";
import listType from "../../../shared/constants/types";

class PaymentOptionRepoImpl implements PaymentOptionRepo {
    async getPaymentOptions(query: Record<string, any> = {}): Promise<listType<PaymentOptionEntity>> {
        const { active, ...publicQuery } = query;
        return await new QueryBuilder<PaymentOptionEntity>(PaymentOptionModel.find({ active: { $ne: false } }), publicQuery)
            .filter()
            .sort()
            .limitFields()
            .paginate()
            .execute();

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
