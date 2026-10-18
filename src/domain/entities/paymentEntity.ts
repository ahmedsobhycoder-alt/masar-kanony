import mongoose from "mongoose";
interface PaymentEntity {
    walletNumber: string;
    walletType: string;
    userWalletNumber: string,

    referenceNumber: string;
    user: mongoose.Types.ObjectId
    receiptImageUrl: string;
    currency: string;
    currencySymbol: string;
    amount: number;
    paymentStatus: string;
    requestNumber: string


    rejectionReason: string | null;
    rejectionMessage: string | null;
    reviewedAt: Date;              // Timestamp when admin verified payment
    reviewedByAdminId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export default PaymentEntity;
