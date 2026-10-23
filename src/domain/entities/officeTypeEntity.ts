import mongoose from "mongoose";

export interface OfficeTypeEntity {
    _id: mongoose.Types.ObjectId;
    id: number;
    name: string;
    description?: string;
}