import PaymentOptionRepo from "../repositories/paymentOptionRepo";
import PaymentOptionEntity from "../entities/paymentOption";
import { QueryPagination } from "../../shared/utils/queryBuilder";

class PaymentOptionUseCases {
    readonly paymentOptionRepo: PaymentOptionRepo;
    constructor({ paymentOptionRepo }: { paymentOptionRepo: PaymentOptionRepo }) {
        this.paymentOptionRepo = paymentOptionRepo
    }
    createPaymentOption = (paymentOptionData: PaymentOptionEntity): Promise<PaymentOptionEntity> => this.paymentOptionRepo.createPaymentOption(
        paymentOptionData
    );
    getPaymentOptions=(query: Record<string, any>): Promise<{ data: PaymentOptionEntity[]; pagination?: QueryPagination }>=>this.paymentOptionRepo.getPaymentOptions(
        query
    );
}

export default PaymentOptionUseCases;