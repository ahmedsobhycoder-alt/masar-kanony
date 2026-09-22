import mongoose,{ model,Schema } from "mongoose";  
import  CourtEntity  from "../../../domain/entities/courtEntity";
const courtSchema = new Schema<CourtEntity>({   
    name: {
        type: String,
        required: [true, 'Court name is required'],
        unique: [true, 'Court name must be unique'],
        trim: true,

    },
    address : {
        type: String,
        required: [true, 'Court address is required'],
    },
    nFloors : {
        type: Number,
        required: false,
        default: 0
    },
    nOffices: {
        type: Number,
        required: false,
        default: 0
    },// The two new time fields

    startingWorkingHours: { type: String, required:false,
        default: '10:00',
     },
    endWorkingHours: { type: String, required: false ,default: '18:00'},

    floors : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Floors"
    }],
    governorate : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Governorates",
        required: [true, 'Governorate is required'],
    },
    courtType : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "CourtTypes",
        required: [true, 'Court type is required'],
    }
}, { timestamps: true , versionKey: false });

const  CourtModel = model<CourtEntity>('Courts', courtSchema,);
export default CourtModel;