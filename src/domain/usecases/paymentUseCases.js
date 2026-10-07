"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PaymentUseCases {
    paymentRepo;
    constructor({ paymentRepo }) {
        this.paymentRepo = paymentRepo;
    }
    createPayment = (paymentData) => this.paymentRepo.createPayment(paymentData);
    getPayments = (query) => this.paymentRepo.getPayments(query);
    getPaymentById = (id) => this.paymentRepo.getPaymentById(id);
    updatePaymentStatus = (id, status) => this.paymentRepo.updatePaymentStatus(id, status);
    deletePaymentById = (id) => this.paymentRepo.deletePaymentById(id);
    approvePayment = (id) => this.paymentRepo.approvePayment(id);
    declinePayment = (id) => this.paymentRepo.declinePayment(id);
}
exports.default = PaymentUseCases;
