import mongoose, { Schema } from "mongoose";
import PaymentEntity from "../../../domain/entities/paymentEntity";
import { AdsEntity } from "../../../domain/entities/adsEntity";
// 2. Schema definition
const paymentSchema = new Schema<PaymentEntity>(
  {
    walletNumber: {
      type: String,
      required: [true, "Wallet number is required"],
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // Adjust reference to match your User model name
      required: [true, "User is required"],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    transactionId: {
      type: String,
      required: [true, "Transaction ID is required"],
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      trim: true,
      default: "PENDING",
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);
paymentSchema.post("init", function (doc) {
  formatImageUrl(doc);
})
paymentSchema.post("save", function (doc) {
  formatImageUrl(doc);
});
const formatImageUrl = (doc: PaymentEntity) => {
  if (doc.transactionId) {
    doc.transactionId = `${process.env.BASE_URL}:${process.env.PORT}/uploads/payments/${doc.transactionId}`;
  }
};
// 3. Model creation
const PaymentModel: mongoose.Model<PaymentEntity> = mongoose.model<PaymentEntity>(
  "Payment",
  paymentSchema
);
export default PaymentModel;