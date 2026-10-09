import  PaymentEntity  from "../entities/paymentEntity";
import { QueryPagination } from "../../shared/utils/queryBuilder";

interface PaymentRepo {
  createPayment(paymentData: PaymentEntity): Promise<PaymentEntity>;
  getPayments(query?: Record<string, any>): Promise<{ data: PaymentEntity[]; pagination?: QueryPagination }>;
  getPaymentById(id: string): Promise<PaymentEntity | null>;
  updatePaymentStatus(id: string, status: string): Promise<PaymentEntity | null>;
  deletePaymentById(id: string): Promise<PaymentEntity | null>;
  approvePayment(id: string,): Promise<PaymentEntity >;
  declinePayment(id: string): Promise<PaymentEntity >;
  getPaymentStatus(id: string): Promise<PaymentEntity | null>;
}

export default PaymentRepo;