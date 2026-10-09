import OfficeEntity from "../../../domain/entities/officeEntity";
import mongoose from "mongoose";
import CourtModel from "./courtModel";
import FloorModel from "./floorModel";
import { printBlue } from "../../../shared/utils/printColors";

interface OfficeModelStatic extends mongoose.Model<OfficeEntity> {
    calculateNumberOfFOfficesPerFloor: (floor: mongoose.Types.ObjectId, method: string) => Promise<void>;
    calculateNumberOfFOfficesPerCourt: (court: mongoose.Types.ObjectId, method: string) => Promise<void>;
}
const officeSchema = new mongoose.Schema<OfficeEntity, OfficeModelStatic>({
    floor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Floors",
        required: [true, "Floor ID is required"]
    },
    court: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Courts",
        required: [true, "Court ID is required"],
    },
    officeType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OfficeTypes",
        required: [true, "Office type ID is required"],
    },
    roomNumber: { type: String, required: [true, "Room number is required"] }, 
    description: { type: String, required: false },
    locationDirection: { type: String, required: [true, "Location direction is required"] },
    startingWorkingHours: {
        type: String, required: false,
        default: "10:00"
    },
    endWorkingHours: {
        type: String, required: false,
        default: "20:00"
    },
    // Fix: Write either [String] directly or [{ type: String }]
    services: [{ type: String }],
    mapUrl: { type: String },
}, { timestamps: true, versionKey: false });
officeSchema.statics.calculateNumberOfFOfficesPerFloor = async function (floor: mongoose.Types.ObjectId, method: string) {
    const nOffices = await this.countDocuments({ floor });
    await FloorModel.updateOne({ _id: floor }, { nOfficesPerFloor: nOffices });
};

officeSchema.statics.calculateNumberOfFOfficesPerCourt = async function (court: mongoose.Types.ObjectId, method: string) {
    const nOffices = await this.countDocuments({ court });
    await CourtModel.updateOne({ _id: court }, { nOffices });
};

officeSchema.pre("save", async function () {
    try {
        const court = await CourtModel.findById(this.court);
        if (court) {
            this.description = `${court.name} - ${this.locationDirection}`;
        }
    } catch (error) {
        console.error("Error in office pre-save hook:", error);
    }
});

officeSchema.post("save", async function (doc) {
    try {
        await OfficesModel.calculateNumberOfFOfficesPerFloor(doc.floor, "save office");
        await OfficesModel.calculateNumberOfFOfficesPerCourt(doc.court, "save office");
        await FloorModel.updateOne({ _id: doc.floor }, {
            $addToSet: { offices: doc._id }
        });
   
    } catch (error) {
        console.error("Error in office post-save hook:", error);
    }
});

officeSchema.post("findOneAndDelete", async function (doc) {
    try {
        if (!doc) return;

        await OfficesModel.calculateNumberOfFOfficesPerFloor(doc.floor, "delete office");
        await OfficesModel.calculateNumberOfFOfficesPerCourt(doc.court, "delete office");
        await FloorModel.updateOne({ _id: doc.floor }, {
            $pull: { offices: doc._id }
        });
    } catch (error) {
        console.error("Error in office post-findOneAndDelete hook:", error);
    }
});

const OfficesModel = mongoose.model<OfficeEntity, OfficeModelStatic>("Offices", officeSchema);
export default OfficesModel;