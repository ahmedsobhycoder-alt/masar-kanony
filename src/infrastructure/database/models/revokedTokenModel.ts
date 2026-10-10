import mongoose, { Schema } from "mongoose";

interface RevokedToken {
    tokenHash: string;
    expiresAt: Date;
}

const revokedTokenSchema = new Schema<RevokedToken>({
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true, expires: 0 },
});

const RevokedTokenModel = mongoose.model<RevokedToken>("RevokedToken", revokedTokenSchema);
export default RevokedTokenModel;