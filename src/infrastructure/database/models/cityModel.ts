import mongoose, { Schema } from "mongoose";
import CityEntity from "../../../domain/entities/cityEntity";

const citySchema = new Schema<CityEntity>({
  id: {
    type: Number,
    unique: true,
    sparse: true,
  },
  name: {
    type: String,
    required: [true, "City name is required"],
    unique: [true, "City name must be unique"],
    trim: true,
  },
  governorate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Governorates",
    required: [true, "Governorate is required"],
  },
}, { timestamps: true, versionKey: false });

const CityModel = mongoose.model<CityEntity>("Cities", citySchema);

export default CityModel;
