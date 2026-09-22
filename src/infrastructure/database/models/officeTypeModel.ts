import mongoose, { Schema } from "mongoose";
import { OfficeTypeEntity } from "../../../domain/entities/officeTypeEntity";

const officeTypeSchema = new Schema<OfficeTypeEntity>({
  id: {
    type: Number,
    required: [true, "Office type id is required"],
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Office type name is required"],
    unique: [true, "Office type name must be unique"],
    trim: true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
});

const OfficeTypeModel = mongoose.model<OfficeTypeEntity>("OfficeTypes", officeTypeSchema);

export default OfficeTypeModel;
