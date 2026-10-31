import mongoose, { Schema } from "mongoose";

const adminAuditLogSchema = new Schema({
  resource: { type: String, enum: ["court", "floor", "office"], required: true, index: true },
  resourceId: { type: Schema.Types.ObjectId, required: true, index: true },
  resourceName: { type: String, required: true },
  action: { type: String, enum: ["updated", "deleted"], required: true, index: true },
  actor: { type: Schema.Types.ObjectId, ref: "users", required: true, index: true },
  actorName: { type: String, required: true },
  actorEmail: { type: String },
  before: { type: Schema.Types.Mixed, required: true },
  after: { type: Schema.Types.Mixed },
  restoredAt: { type: Date },
  restoredBy: { type: Schema.Types.ObjectId, ref: "users" },
  restoredByName: { type: String },
}, { timestamps: true, versionKey: false });

adminAuditLogSchema.index({ createdAt: -1, _id: -1 });
export default mongoose.model("AdminAuditLog", adminAuditLogSchema);

