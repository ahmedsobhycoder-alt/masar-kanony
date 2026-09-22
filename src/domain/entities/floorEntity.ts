import mongoose from 'mongoose';
export interface FloorEntity {
    court: mongoose.Schema.Types.ObjectId;
    floorName : mongoose.Schema.Types.ObjectId;
    nOfficesPerFloor : number;
    image : string;
    offices : mongoose.Types.ObjectId[]
}