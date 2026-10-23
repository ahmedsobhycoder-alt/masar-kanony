import mongoose from "mongoose";

const schema = new mongoose.Schema({
  court: { type: mongoose.Schema.Types.ObjectId, index: true },
  courtName: { type: String },
  action: { type: String, enum: ["created", "updated", "deleted"], required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, required: true },
  adminName: { type: String, required: true },
  adminEmail: { type: String },
  status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
}, { timestamps: true, versionKey: false });
schema.index({ status: 1, createdAt: -1 });
export default mongoose.model("CourtActivity", schema);
