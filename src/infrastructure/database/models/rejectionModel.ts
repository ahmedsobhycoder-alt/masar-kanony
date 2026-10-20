import mongoose, { Schema } from "mongoose";
import RejectionEntity from "../../../domain/entities/rejectionEntity";
const rejectionSchema = new Schema<RejectionEntity>({
    id : mongoose.Schema.Types.ObjectId,
    rejectionReason : {
        type: String,
        required: [true, "Rejection reason is required"],
        unique: [true, "Rejection reason must be unique"],
        lenght: [5, "Rejection reason must be at least 3 characters"],
    },
    rejectionMessage : {
        type: String,
        required: [true, "Rejection message is required"],
        unique: [true, "Rejection message must be unique"],
        length: [5, "Rejection message must be at least 3 characters"],
    }
})

const RejectionModel = mongoose.model<RejectionEntity>("Rejection", rejectionSchema);
export default RejectionModel