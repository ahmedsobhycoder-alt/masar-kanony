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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const courtSchema = new mongoose_1.Schema({
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
    }, // The two new time fields
    startingWorkingHours: { type: String, required: false,
        default: '10:00',
    },
    endWorkingHours: { type: String, required: false, default: '18:00' },
    floors: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Floors"
        }],
    governorate: {
        type: String,
        required: [true, 'Governorate is required'],
    },
    courtType: {
        type: String,
        required: [true, 'Court type is required'],
    }
}, { timestamps: true, versionKey: false });
const CourtModel = (0, mongoose_1.model)('Courts', courtSchema);
exports.default = CourtModel;
