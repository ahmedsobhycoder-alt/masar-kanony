import PaymentOptionEntity  from "../entities/paymentOption";
import { QueryPagination } from "../../shared/utils/queryBuilder";

interface PaymentOptionRepo {
    getPaymentOptions(query: Record<string, any>): Promise<{ data: PaymentOptionEntity[]; pagination?: QueryPagination }>;
    getPaymentOptionById(id: string): Promise<PaymentOptionEntity | null>;
    createPaymentOption(paymentOptionData: PaymentOptionEntity): Promise<PaymentOptionEntity>;
    updatePaymentOption(id: string, paymentOptionData: PaymentOptionEntity): Promise<PaymentOptionEntity | null>;
    deletePaymentOptionById(id: string): Promise<PaymentOptionEntity | null>;
}
export default PaymentOptionRepo;