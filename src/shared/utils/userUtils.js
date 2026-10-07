"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
class UserUtils {
    static hashPassword = async (password) => {
        return bcrypt_1.default.hash(password, 10);
    };
    static comparePassword = async (password, hashedPassword) => {
        return bcrypt_1.default.compare(password, hashedPassword);
    };
    static createToken = (payload) => {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }
        const options = {
            expiresIn: (process.env.JWT_EXPIRES_IN || "90d"),
        };
        return jsonwebtoken_1.default.sign(payload, secret, options);
    };
    static generateOTP = () => {
        // Generates a number between 1000 and 9999
        return crypto_1.default.randomInt(1000, 10000).toString();
    };
}
exports.default = UserUtils;
