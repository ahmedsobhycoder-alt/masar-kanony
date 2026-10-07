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
exports.policyTypeValues = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var PolicyType;
(function (PolicyType) {
    PolicyType["TERMS_AND_CONDITIONS"] = "termsAndConditions";
    PolicyType["PRIVACY_POLICY"] = "privacyPolicy";
})(PolicyType || (PolicyType = {}));
const policyTypeValues = Object.values(PolicyType);
exports.policyTypeValues = policyTypeValues;
const policySectionSchema = new mongoose_1.Schema({
    order: {
        type: Number,
        required: [true, "Section order is required"],
    },
    sectionTitle: {
        type: String,
        required: [true, "Section title is required"],
        trim: true,
    },
    sectionContent: {
        type: String,
        required: [true, "Section content is required"],
        trim: true,
    }
}, { _id: false });
const appPolicySchema = new mongoose_1.Schema({
    type: {
        type: String,
        required: [true, "Policy type is required"],
        enum: Object.values(PolicyType),
        unique: [true, "Policy type must be unique"],
    },
    intro: {
        type: String,
        required: [true, "Policy intro is required"],
        trim: true,
    },
    sections: {
        type: [policySectionSchema],
        required: [true, "Policy sections are required"],
    },
    lastUpdate: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true,
    versionKey: false,
});
const AppPolicyModel = mongoose_1.default.model("AppPolicies", appPolicySchema);
exports.default = AppPolicyModel;
