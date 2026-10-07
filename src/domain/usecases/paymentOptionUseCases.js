"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PaymentOptionUseCases {
    paymentOptionRepo;
    constructor({ paymentOptionRepo }) {
        this.paymentOptionRepo = paymentOptionRepo;
    }
    createPaymentOption = (paymentOptionData) => this.paymentOptionRepo.createPaymentOption(paymentOptionData);
    getPaymentOptions = (query) => this.paymentOptionRepo.getPaymentOptions(query);
}
exports.default = PaymentOptionUseCases;
