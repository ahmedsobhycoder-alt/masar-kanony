import PaymentOptionEntity  from "../entities/paymentOption";
import listType from "../../shared/constants/types";

interface PaymentOptionRepo {
    getPaymentOptions(query: Record<string, any>): Promise<listType<PaymentOptionEntity>>;
    getPaymentOptionById(id: string): Promise<PaymentOptionEntity | null>;
    createPaymentOption(paymentOptionData: PaymentOptionEntity): Promise<PaymentOptionEntity>;
    updatePaymentOption(id: string, paymentOptionData: PaymentOptionEntity): Promise<PaymentOptionEntity | null>;
    deletePaymentOptionById(id: string): Promise<PaymentOptionEntity | null>;
}
export default PaymentOptionRepo;