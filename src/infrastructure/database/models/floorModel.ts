import { FloorEntity } from "../../../domain/entities/floorEntity";
import mongoose, { model, Schema } from "mongoose";
import CourtModel from "./courtModel";
import { printRed, printBlue, printGreen } from "../../../shared/utils/printColors";
import { stringify } from "node:querystring";

interface FloorModelStatic extends mongoose.Model<FloorEntity> {
    calculateNumberOfFloorsPerCourt: (court: mongoose.Schema.Types.ObjectId, method: string) => Promise<void>;
}

export const floorSchema = new Schema<FloorEntity, FloorModelStatic>({
    court: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Courts",
        required: [true, "Court ID is required"],
    },
    floorName: {
        type: String,
        unique: [true, "Floor Name must be unique for court"],
        required: [true, "Floor Name is required"],
    },
    nOfficesPerFloor: {
        type: Number,
        required: false,
        default: 0,
    },
    image: {
        type: String,
        required: [true, "Floor images is required"],
    },
    offices: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Offices",
        },
    ],
});

floorSchema.statics.calculateNumberOfFloorsPerCourt = async function (
    courtId: FloorEntity["court"],
    method: string
) {
    console.log(`[Floor Model] Recalculating floors for court ${courtId} (Trigger: ${method})`);

    try {
        const nFloors = await this.countDocuments({ court: courtId });
        await CourtModel.findByIdAndUpdate(courtId, { nFloors });
    } catch (error) {
        console.error(`[Floor Model] Failed to calculate floors for court ${courtId}:`, error);
        throw error;
    }
};

floorSchema.post("init", function (doc) {
    try {
        formatImageUrl(doc);
    } catch (error) {
        console.error("Error in Floor post-init hook:", error);
        throw error;
    }
});
// 2. Handle database relationships AFTER saving:
floorSchema.post("save", async function (doc, next) {
    try {
        // Use doc.constructor to avoid the initialization crash
        const FloorModelStatic = doc.constructor as any;

        await FloorModelStatic.calculateNumberOfFloorsPerCourt(doc.court, "create");

        // $addToSet is perfect here. It's safer than $push because it prevents duplicates.
        await CourtModel.findByIdAndUpdate(doc.court, {
            $addToSet: { floors: doc._id }
        });

        next(); // Tell Mongoose the hook is successfully finished
    } catch (error) {
        console.error("Error in Floor post-save hook:", error);
        next(error as mongoose.CallbackError);
    }
});
floorSchema.post("findOneAndDelete", async function (doc) {
    try {
        if (!doc) return;
        await FloorModel.calculateNumberOfFloorsPerCourt(doc.court, "delete floor");
    } catch (error) {
        console.error("Error in Floor post-delete hook:", error);
        throw error;
    }
});
const formatImageUrl = (doc: FloorEntity) => {
    if (doc.image) {
        doc.image = `${process.env.BASE_URL}/floors/${doc.image}`;
        printRed("image", doc.image);

    }

}
const FloorModel = model<FloorEntity, FloorModelStatic>("Floors", floorSchema);
export default FloorModel;
