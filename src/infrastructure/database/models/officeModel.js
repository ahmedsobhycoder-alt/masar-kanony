"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const courtModel_1 = __importDefault(require("./courtModel"));
const floorModel_1 = __importDefault(require("./floorModel"));
const officeSchema = new mongoose_1.default.Schema({
    floor: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Floors",
        required: [true, "Floor ID is required"]
    },
    court: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Courts",
        required: [true, "Court ID is required"],
    },
    officeType: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
    services: { type: [String], required: [true, "Services are required"] },
    mapUrl: { type: String },
}, { timestamps: true, versionKey: false });
officeSchema.statics.calculateNumberOfFOfficesPerFloor = async function (floor, method) {
    const nOffices = await this.countDocuments({ floor });
    await floorModel_1.default.updateOne({ _id: floor }, { nOfficesPerFloor: nOffices });
};
officeSchema.statics.calculateNumberOfFOfficesPerCourt = async function (court, method) {
    const nOffices = await this.countDocuments({ court });
    await courtModel_1.default.updateOne({ _id: court }, { nOffices });
};
officeSchema.pre("save", async function () {
    try {
        const court = await courtModel_1.default.findById(this.court);
        if (court) {
            this.description = `${court.name} - ${this.locationDirection}`;
        }
    }
    catch (error) {
        console.error("Error in office pre-save hook:", error);
    }
});
officeSchema.post("save", async function (doc) {
    try {
        await OfficesModel.calculateNumberOfFOfficesPerFloor(doc.floor, "save office");
        await OfficesModel.calculateNumberOfFOfficesPerCourt(doc.court, "save office");
        await floorModel_1.default.updateOne({ _id: doc.floor }, {
            $addToSet: { offices: doc._id }
        });
    }
    catch (error) {
        console.error("Error in office post-save hook:", error);
    }
});
officeSchema.post("findOneAndDelete", async function (doc) {
    try {
        if (!doc)
            return;
        await OfficesModel.calculateNumberOfFOfficesPerFloor(doc.floor, "delete office");
        await OfficesModel.calculateNumberOfFOfficesPerCourt(doc.court, "delete office");
        await floorModel_1.default.updateOne({ _id: doc.floor }, {
            $pull: { offices: doc._id }
        });
    }
    catch (error) {
        console.error("Error in office post-findOneAndDelete hook:", error);
    }
});
const OfficesModel = mongoose_1.default.model("Offices", officeSchema);
exports.default = OfficesModel;
