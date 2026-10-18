interface PaymentOptionEntity {
    paymentType: string;
    phone: string;
    active?: boolean;
        createdAt: Date;
    updatedAt: Date;
}
export default PaymentOptionEntity;
