import mongoose, { Schema } from "mongoose";
import FloorNameEntity from "../../../domain/entities/floorNameEntity";

const floorNameSchema = new Schema<FloorNameEntity>({
    id: {
        type: Number,
        required: [true, "Floor id is required"],
        unique: true
    },
  name: {
    type: String,
    required: [true, "Floor name is required"],
    unique: [true, "Floor name must be unique"],
    trim: true,
  },
});

const FloorNameModel = mongoose.model<FloorNameEntity>("FloorNames", floorNameSchema);

export default FloorNameModel;
