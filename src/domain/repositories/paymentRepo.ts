import  PaymentEntity  from "../entities/paymentEntity";
import listType from "../../shared/constants/types";

interface PaymentRepo {
  createPayment(paymentData: PaymentEntity): Promise<PaymentEntity>;
  getPayments(query?: Record<string, any>): Promise<listType<PaymentEntity>>;
  getPaymentById(id: string): Promise<PaymentEntity | null>;
  updatePaymentStatus(id: string, status: string, reviewerId?: string, reason?: string, message?: string): Promise<PaymentEntity | null>;
  deletePaymentById(id: string): Promise<PaymentEntity | null>;
  approvePayment(id: string, reviewerId?: string): Promise<PaymentEntity >;
  declinePayment(id: string, reviewerId?: string, reason?: string, message?: string): Promise<PaymentEntity >;
  getPaymentStatus(id: string): Promise<PaymentEntity | null>;
}

export default PaymentRepo;
