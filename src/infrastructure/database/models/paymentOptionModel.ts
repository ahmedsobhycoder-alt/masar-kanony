import mongoose, { Schema } from "mongoose";
import PaymentOptionEntity from "../../../domain/entities/paymentOption";
const PaymentOptionSchema = new Schema<PaymentOptionEntity>({
    paymentType: {
        type: String,
        required: [true, "wallet type is required"],
        unique: [true, "wallet type must be unique"]
    },
    phone: {
        type: String,
        required: [true, "wallet phone is required"],
        unique: [true, "wallet phone must be unique"],
        length: [11, "password must be 11 digits"],

    }
}, {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);
const PaymentOptionModel = mongoose.model<PaymentOptionEntity>("Wallets", PaymentOptionSchema);
export default PaymentOptionModel;