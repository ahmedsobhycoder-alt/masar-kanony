import mongoose from 'mongoose';
export interface FloorEntity {
    court: mongoose.Schema.Types.ObjectId;
    floorName : string;
    nOfficesPerFloor : number;
    image : string;
    offices : mongoose.Types.ObjectId[]
}