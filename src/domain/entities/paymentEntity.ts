import mongoose from "mongoose";
interface PaymentEntity {
    walletNumber: string;
    user : mongoose.Types.ObjectId
    amount: number;
    transactionId: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
export default PaymentEntity;