"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.floorSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const courtModel_1 = __importDefault(require("./courtModel"));
const printColors_1 = require("../../../shared/utils/printColors");
exports.floorSchema = new mongoose_1.Schema({
    court: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Offices",
        },
    ],
});
exports.floorSchema.statics.calculateNumberOfFloorsPerCourt = async function (courtId, method) {
    console.log(`[Floor Model] Recalculating floors for court ${courtId} (Trigger: ${method})`);
    try {
        const nFloors = await this.countDocuments({ court: courtId });
        await courtModel_1.default.findByIdAndUpdate(courtId, { nFloors });
    }
    catch (error) {
        console.error(`[Floor Model] Failed to calculate floors for court ${courtId}:`, error);
        throw error;
    }
};
exports.floorSchema.post("init", function (doc) {
    try {
        formatImageUrl(doc);
    }
    catch (error) {
        console.error("Error in Floor post-init hook:", error);
        throw error;
    }
});
// 2. Handle database relationships AFTER saving:
exports.floorSchema.post("save", async function (doc, next) {
    try {
        // Use doc.constructor to avoid the initialization crash
        const FloorModelStatic = doc.constructor;
        await FloorModelStatic.calculateNumberOfFloorsPerCourt(doc.court, "create");
        // $addToSet is perfect here. It's safer than $push because it prevents duplicates.
        await courtModel_1.default.findByIdAndUpdate(doc.court, {
            $addToSet: { floors: doc._id }
        });
        next(); // Tell Mongoose the hook is successfully finished
    }
    catch (error) {
        console.error("Error in Floor post-save hook:", error);
        next(error);
    }
});
exports.floorSchema.post("findOneAndDelete", async function (doc) {
    try {
        if (!doc)
            return;
        await FloorModel.calculateNumberOfFloorsPerCourt(doc.court, "delete floor");
    }
    catch (error) {
        console.error("Error in Floor post-delete hook:", error);
        throw error;
    }
});
const formatImageUrl = (doc) => {
    if (doc.image) {
        doc.image = `${process.env.BASE_URL}/floors/${doc.image}`;
        (0, printColors_1.printRed)("image", doc.image);
    }
};
const FloorModel = (0, mongoose_1.model)("Floors", exports.floorSchema);
exports.default = FloorModel;
