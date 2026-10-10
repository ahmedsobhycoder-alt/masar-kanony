import { mongo } from "mongoose";
import { FloorEntity } from "./floorEntity";
import mongoose from "mongoose";
export default interface CourtEntity {
    id: string;
    _id: mongoose.Types.ObjectId;
    name: string;
    type: mongoose.Types.ObjectId;
    address: string;
    nFloors: number;
    nOffices: number;
    floors: mongoose.Types.ObjectId[];
    startingWorkingHours: string; // e.g., "09:00"
    endWorkingHours: string;
    governorate: string;
    courtType: string;
    nViews: number;
    updatedAt?: Date;
    createdAt?: Date;
    savedBy? : mongoose.Types.ObjectId[]
    isSaved : Boolean
    
}