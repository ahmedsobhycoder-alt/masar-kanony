import mongoose, { Schema, Document } from "mongoose";
import AppConfigEntity from "../../../domain/entities/appConfigEntity";
import CourtModel from "./courtModel";

// 1. Extend Document omitting the custom id (Mongoose handles _id internally)


// 2. Define Sub-Schemas
const contactInfoSchema = new Schema(
    {
        whatsappNumber: {
            type: String,
            required: true,
            trim: true,
            length: [
                11,
                "WhatsApp number must be exactly 11 characters long",
            ],
        },
        email: {
            type: String,
            required: true,
            trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
        },
    },
    { _id: false }
);

const statsSchema = new Schema(
    {
        courtsCount: {
            type: Number,
            default: 0,
        },
        governoratesCount: {
            type: Number,
            default: 0,
        },
        lastDataUpdate: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: false }
);

const socialMediaLinksSchema = new Schema(
    {
        facebook: {
            type: String,
            trim: true,
            default: null,
        },
        instagram: {
            type: String,
            trim: true,
            default: null,
        },
    },
    { _id: false }
);

// 3. Define Main Schema
const appConfigSchema = new Schema<AppConfigEntity>(
    {
        appName: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
      
       
        contactInfo: {
            type: contactInfoSchema,
            required: true,
        },
        stats: {
            type: statsSchema,
            required: true,
        },
        socialMediaLinks: {
            type: socialMediaLinksSchema,
            default: {},
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (_, ret: Record<string, any>) => {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
        toObject: {
            virtuals: true,
            transform: (_, ret: Record<string, any>) => {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);
appConfigSchema.pre("save",async function () {
    const courtsCount = await CourtModel.countDocuments();
   const uniqueGovernorates = await CourtModel.distinct("governorate", {
  governorate: { $exists: true, $ne: null },
});
    this.stats.courtsCount = courtsCount;
    this.stats.governoratesCount = uniqueGovernorates.length;
    this.stats.lastDataUpdate = CourtModel.schema.path("updatedAt") ? new Date() : new Date();
   
    
});


// 4. Create and Export Model
export const AppConfigModel = mongoose.model<AppConfigEntity>(
    "AppConfig",
    appConfigSchema
);



export default AppConfigModel;