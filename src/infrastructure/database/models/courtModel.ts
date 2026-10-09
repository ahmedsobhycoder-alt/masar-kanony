import mongoose, { model, Schema } from "mongoose";
import CourtEntity from "../../../domain/entities/courtEntity";
import { ref } from "node:process";
const courtSchema = new Schema<CourtEntity>({
    name: {
        type: String,
        required: [true, 'Court name is required'],
        unique: [true, 'Court name must be unique'],
        trim: true,

    },
    address: {
        type: String,
        required: [true, 'Court address is required'],
    },
    nFloors: {
        type: Number,
        required: false,
        default: 0
    },
    nViews: {
        type: Number,
        required: false,
        default: 0
    },
    nOffices: {
        type: Number,
        required: false,
        default: 0
    },// The two new time fields

    startingWorkingHours: {
        type: String, required: false,
        default: '10:00',
    },
    endWorkingHours: { type: String, required: false, default: '18:00' },

    floors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Floors"
    }],
    governorate: {
        type: String,
        required: [true, 'Governorate is required'],
    },
    courtType: {
        type: String,
        required: [true, 'Court type is required'],
    },
    savedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    isSaved: {
        type: Boolean,
        required: false,
        default: false,
        virtual: true
    }
}, { timestamps: true, versionKey: false  });

const CourtModel = model<CourtEntity>('Courts', courtSchema,);
export default CourtModel;