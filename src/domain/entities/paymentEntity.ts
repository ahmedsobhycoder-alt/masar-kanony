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


    rejectionReason: string;      // Shown on screen when REJECTED (e.g., "صورة الإيصال غير واضحة")
    rejectionMessage: string;     // Shown on screen when REJECTED (e.g., "يرجى تحديث صورة الإيصال")
    reviewedAt: Date;              // Timestamp when admin verified payment
    reviewedByAdminId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export default PaymentEntity;