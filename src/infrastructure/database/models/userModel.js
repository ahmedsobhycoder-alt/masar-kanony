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
const mongoose_1 = __importStar(require("mongoose"));
const userUtils_1 = __importDefault(require("../../../shared/utils/userUtils"));
const printColors_1 = require("../../../shared/utils/printColors");
const user_roles_enum_1 = __importDefault(require("../../../shared/constants/user-roles.enum"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        trim: true,
        minlength: [2, "name must be at least 3 characters"],
        maxlength: [20, "name must be at most 32 characters"],
        required: [true, "name is required"],
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: [true, "email is required"],
        minlength: [11, "password must be 11 digits"],
    },
    phone: {
        type: String,
        required: [true, "phone is required"],
        unique: [true, "phone number must be unique"]
    },
    password: {
        type: String,
        minlength: [6, "password must be at least 6 characters"],
        required: [true, "password is required"],
    },
    passwordChangedAt: Date,
    resetCode: String,
    resetCodeExpires: Date,
    resetCodeVerified: Boolean, active: {
        type: Boolean,
        default: true,
    },
    verified: {
        type: Boolean,
        default: false
    },
    profileImage: {
        type: String,
    },
    role: {
        type: String,
        enum: ["user", "admin", "manager"],
        default: user_roles_enum_1.default.USER,
    },
    isSubscribed: {
        type: Boolean,
        default: false
    }
});
userSchema.pre("save", async function () {
    // Only hash the password if it has actually been modified (or is new)
    (0, printColors_1.printGreen)("password", `Password before hashing: ${this.password}`);
    if (!this.isModified("password"))
        return;
    (0, printColors_1.printGreen)("password", `Password after hashing: ${this.password}`);
    this.password = await userUtils_1.default.hashPassword(this.password);
});
const UserModel = mongoose_1.default.model("users", userSchema);
exports.default = UserModel;
