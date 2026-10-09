import PaymentRepo from "../repositories/paymentRepo";
import  PaymentEntity  from "../entities/paymentEntity";
import { QueryPagination } from "../../shared/utils/queryBuilder";

class PaymentUseCases {
  readonly paymentRepo: PaymentRepo;

  constructor({ paymentRepo }: { paymentRepo: PaymentRepo }) {
    this.paymentRepo = paymentRepo;
  }

  createPayment = (paymentData: PaymentEntity): Promise<PaymentEntity> =>
    this.paymentRepo.createPayment(paymentData);

  getPayments = (
    query: Record<string, any>
  ): Promise<{ data: PaymentEntity[]; pagination?: QueryPagination }> =>
    this.paymentRepo.getPayments(query);

  getPaymentById = (id: string): Promise<PaymentEntity | null> =>
    this.paymentRepo.getPaymentById(id);


  updatePaymentStatus = (id: string, status: string): Promise<PaymentEntity | null> =>
    this.paymentRepo.updatePaymentStatus(id, status);

  deletePaymentById = (id: string): Promise<PaymentEntity | null> =>
    this.paymentRepo.deletePaymentById(id);
    approvePayment=(id: string): Promise<PaymentEntity >=> this.paymentRepo.approvePayment(id);
    declinePayment=(id: string): Promise<PaymentEntity >=> this.paymentRepo.declinePayment(id);
    getPaymentStatus=(id: string): Promise<PaymentEntity | null> => this.paymentRepo.getPaymentStatus(id);
}

export default PaymentUseCases;