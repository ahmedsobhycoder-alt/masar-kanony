import mongoose from "mongoose";

const schema = new mongoose.Schema({
  _id: { type: String, required: true },
  value: { type: Number, required: true, default: 0 },
}, { versionKey: false });
export default mongoose.model("Sequence", schema);
