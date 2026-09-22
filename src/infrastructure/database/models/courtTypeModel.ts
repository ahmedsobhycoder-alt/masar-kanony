import mongoose, { Schema } from "mongoose";
import { CourtTypeEntity } from "../../../domain/entities/courtTypeEntity";

const courtTypeSchema = new Schema<CourtTypeEntity>({
  id: {
    type: Number,
    required: [true, "Court type id is required"],
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Court type name is required"],
    unique: [true, "Court type name must be unique"],
    trim: true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
});

const CourtTypeModel = mongoose.model<CourtTypeEntity>("CourtTypes", courtTypeSchema);

export default CourtTypeModel;
