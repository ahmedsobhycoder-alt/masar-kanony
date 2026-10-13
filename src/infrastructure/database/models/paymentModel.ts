import mongoose, { CallbackError, Schema } from "mongoose";
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
 requestNumber: {
  type: String,
  trim: true,
  unique: true,
  sparse: true, // Prevents duplicate key errors if a document doesn't have a requestNumber yet
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
import crypto from "crypto";

paymentSchema.pre("save", async function () {
  if (this.isNew && !this.requestNumber) {
    let candidateNumber = `#SUB-${this._id.toString().slice(-6).toUpperCase()}`;
    
    // Check if another document already took this candidate number
    const PaymentModel = this.constructor as any;
    let exists = await PaymentModel.exists({ requestNumber: candidateNumber });

    // In the rare event of a collision, generate random 6-hex bytes until unique
    while (exists) {
      const randomHex = crypto.randomBytes(3).toString("hex").toUpperCase();
      candidateNumber = `#SUB-${randomHex}`;
      exists = await PaymentModel.exists({ requestNumber: candidateNumber });
    }

    this.requestNumber = candidateNumber;
  }
});
paymentSchema.post("init", function (doc) {
  formatImageUrl(doc);
})
// 1. Success hook: formats image URL when save succeeds
paymentSchema.post("save", function (doc) {
  if (doc) {
    formatImageUrl(doc);
  }
});

// 2. Error-handling hook: intercepts MongoDB duplicate key errors
paymentSchema.post(
  "save",
  function (error: any, doc: any, next: (err?: CallbackError) => void) {
    if (error.name === "MongoServerError" && error.code === 11000) {
      if (error.keyPattern?.requestNumber) {
        return next(new Error("Request number must be unique"));
      }
    }
    next(error);
  }
);
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