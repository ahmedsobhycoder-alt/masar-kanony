import mongoose, { Schema } from "mongoose";
import PaymentEntity from "../../../domain/entities/paymentEntity";
import { AdsEntity } from "../../../domain/entities/adsEntity";
import PaymentStatus, { PaymentStatusValues } from "../../../shared/constants/payment-status.enums";
// 2. Schema definition
const paymentSchema = new Schema<PaymentEntity>(
  {
    walletNumber: {
      type: String,
      required: [true, "Wallet number is required"],
      trim: true,
    },
    userWalletNumber: {
      type: String,
      trim: true,
      default: null,
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
    receiptImageUrl: {
      type: String,
      required: [true, "payment wallet image is required"],
      unique: true,
      trim: true,
    },
    paymentStatus: {
      type: String,
      enum: PaymentStatusValues,
      required: [true, "Payment Status is required"],
      trim: true,
      
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      trim: true,
      uppercase: true,
      minlength: [2, "Currency must be 3 at least 3 characters"],
      maxlength: [3, "Currency must be 3 characters"],
    },
    currencySymbol: {
      type: String,
      required: [true, "Currency symbol is required"],
      trim: true,
    },
    reviewedByAdminId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Adjust reference to match your User model name


    },
    reviewedAt: {
      type: Date,
      default: null
    },
    rejectionReason: {
      type: String,
      default: null
    },
    rejectionMessage: {
      type: String,
      default: null
    },
    walletType: {
      type: String,
      required: [true, "Wallet Type is required"],
      trim: true,
    }
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
    toJSON: { versionKey: false },
  }
);
paymentSchema.post("init", function (doc) {
  formatImageUrl(doc);
})
paymentSchema.post("save", function (doc) {
  formatImageUrl(doc);
});
const formatImageUrl = (doc: PaymentEntity) => {
  if (doc.receiptImageUrl) {
    if (process.env.NODE_ENV === "production") {
      doc.receiptImageUrl = `${process.env.BASE_URL}:/uploads/payments/${doc.receiptImageUrl}`;
    } else {
      doc.receiptImageUrl = `${process.env.BASE_URL}:${process.env.PORT}/uploads/payments/${doc.receiptImageUrl}`;
    }

  }
};
// 3. Model creation
const PaymentModel: mongoose.Model<PaymentEntity> = mongoose.model<PaymentEntity>(
  "Payment",
  paymentSchema
);
export default PaymentModel;