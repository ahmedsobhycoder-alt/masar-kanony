import PaymentRepo from "../repositories/paymentRepo";
import  PaymentEntity  from "../entities/paymentEntity";
import listType from "../../shared/constants/types";

class PaymentUseCases {
  readonly paymentRepo: PaymentRepo;

  constructor({ paymentRepo }: { paymentRepo: PaymentRepo }) {
    this.paymentRepo = paymentRepo;
  }

  createPayment = (paymentData: PaymentEntity): Promise<PaymentEntity> =>
    this.paymentRepo.createPayment(paymentData);

  getPayments = (
    query: Record<string, any>
  ): Promise<listType<PaymentEntity>> =>
    this.paymentRepo.getPayments(query);

  getPaymentById = (id: string): Promise<PaymentEntity | null> =>
    this.paymentRepo.getPaymentById(id);


  updatePaymentStatus = (id: string, status: string, reviewerId?: string, reason?: string, message?: string): Promise<PaymentEntity | null> =>
    this.paymentRepo.updatePaymentStatus(id, status, reviewerId, reason, message);

  deletePaymentById = (id: string): Promise<PaymentEntity | null> =>
    this.paymentRepo.deletePaymentById(id);
    approvePayment=(id: string, reviewerId?: string): Promise<PaymentEntity >=> this.paymentRepo.approvePayment(id, reviewerId);
    declinePayment=(id: string, reviewerId?: string, reason?: string, message?: string): Promise<PaymentEntity >=> this.paymentRepo.declinePayment(id, reviewerId, reason, message);
    getPaymentStatus=(id: string): Promise<PaymentEntity | null> => this.paymentRepo.getPaymentStatus(id);
}

export default PaymentUseCases;
