import { mongo } from "mongoose";
import { FloorEntity } from "./floorEntity";
import mongoose from "mongoose";
export default interface CourtEntity {
    name: string;
    type: mongoose.Types.ObjectId;
    address: string;
    nFloors: number;
    nOffices: number;
    floors: mongoose.Types.ObjectId[];
    startingWorkingHours: string; // e.g., "09:00"
    endWorkingHours: string;
    governorate: mongoose.Types.ObjectId;
    courtType: mongoose.Types.ObjectId;
    
}