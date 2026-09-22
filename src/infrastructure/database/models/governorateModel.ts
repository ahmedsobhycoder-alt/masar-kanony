import mongoose, { Schema } from "mongoose";
import GovernorateEntity from "../../../domain/entities/governorateEntity";

const governorateSchema = new Schema<GovernorateEntity>({
    id: {
        type: Number,
        required: [true, "Governorate id is required"],
        unique: true
    },
  name: {
    type: String,
    required: [true, "Governorate name is required"],
    unique: [true, "Governorate name must be unique"],
    trim: true,
  },
});

const GovernorateModel = mongoose.model<GovernorateEntity>("Governorates", governorateSchema);

export default GovernorateModel;
