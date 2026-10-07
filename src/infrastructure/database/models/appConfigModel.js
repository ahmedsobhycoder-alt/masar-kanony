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
exports.AppConfigModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const courtModel_1 = __importDefault(require("./courtModel"));
// 1. Extend Document omitting the custom id (Mongoose handles _id internally)
// 2. Define Sub-Schemas
const contactInfoSchema = new mongoose_1.Schema({
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
}, { _id: false });
const statsSchema = new mongoose_1.Schema({
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
}, { _id: false });
const socialMediaLinksSchema = new mongoose_1.Schema({
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
}, { _id: false });
// 3. Define Main Schema
const appConfigSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (_, ret) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
    toObject: {
        virtuals: true,
        transform: (_, ret) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
appConfigSchema.pre("save", async function () {
    const courtsCount = await courtModel_1.default.countDocuments();
    const uniqueGovernorates = await courtModel_1.default.distinct("governorate", {
        governorate: { $exists: true, $ne: null },
    });
    this.stats.courtsCount = courtsCount;
    this.stats.governoratesCount = uniqueGovernorates.length;
    this.stats.lastDataUpdate = courtModel_1.default.schema.path("updatedAt") ? new Date() : new Date();
});
// 4. Create and Export Model
exports.AppConfigModel = mongoose_1.default.model("AppConfig", appConfigSchema);
exports.default = exports.AppConfigModel;
