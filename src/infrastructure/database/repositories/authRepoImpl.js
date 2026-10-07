"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../models/userModel"));
const emailService_1 = require("../../services/emailService");
const userUtils_1 = __importDefault(require("../../../shared/utils/userUtils"));
const otpModel_1 = __importDefault(require("../models/otpModel"));
const printColors_1 = require("../../../shared/utils/printColors");
const apiError_1 = __importDefault(require("../../../shared/errors/apiError"));
class AuthRepoImpl {
    async signup(userData) {
        // 2. Generate the OTP
        const otp = userUtils_1.default.generateOTP();
        // 3. Save to a temporary OTP collection (with a 10-minute TTL index)
        // We do NOT call UserModel.create() here.
        await otpModel_1.default.create({
            email: userData.email,
            otp: otp,
            pendingUserData: userData // Store their password/name temporarily
        });
        // 4. Send the email
        await (0, emailService_1.sendAuthEmail)(userData.email, otp);
    }
    async verify(email, otp) {
        // 1. Check if the OTP matches and hasn't expired (MongoDB handles the 10-min expiration automatically)
        const otpRecord = await otpModel_1.default.findOne({ email, otp });
        if (!otpRecord) {
            throw new apiError_1.default(400, "Invalid or expired verification code");
        }
        // 2. Extract the pending user data we saved during signup
        const userData = otpRecord.pendingUserData;
        // 3. Mark the user as verified before saving
        userData.verified = true;
        // 4. Create the official user in the main database
        const newUser = await userModel_1.default.create(userData);
        // 5. Delete the OTP record so it cannot be used again
        await otpModel_1.default.deleteOne({ _id: otpRecord._id });
        // 6. Generate the authentication token
        const token = userUtils_1.default.createToken({
            id: newUser._id,
            role: newUser.role
        });
        return {
            user: newUser,
            token
        };
    }
    async login(email, password) {
        const user = await userModel_1.default.findOne({ email });
        if (!user) {
            throw new apiError_1.default(400, "Invalid email");
        }
        (0, printColors_1.printGreen)("email", `User found: ${user.email}, ID: ${user._id}`);
        (0, printColors_1.printGreen)("hased password", `Password provided: ${user.password}`);
        const isPasswordCorrect = await userUtils_1.default.comparePassword(password, user.password);
        if (!isPasswordCorrect) {
            throw new apiError_1.default(400, "Invalid  password");
        }
        const token = userUtils_1.default.createToken({
            id: user._id,
            role: user.role
        });
        return {
            user,
            token
        };
    }
    async forgetPassword(email) {
        const user = await userModel_1.default.findOne({ email });
        if (!user) {
            throw new apiError_1.default(400, "User not found");
        }
        const otp = userUtils_1.default.generateOTP();
        user.resetCode = otp;
        user.resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
        user.resetCodeVerified = false;
        await user.save();
        await (0, emailService_1.sendAuthEmail)(email, otp);
    }
    async verifyResetCode(email, resetCode) {
        // 1. Find user by email, matching reset code, ensuring the code hasn't expired
        const user = await userModel_1.default.findOne({
            email,
            resetCode,
            resetCodeExpires: { $gt: Date.now() }
        });
        if (!user) {
            throw new apiError_1.default(400, "Invalid or expired reset code");
        }
        // 2. Mark the reset code as verified so they can proceed to choose a new password
        user.resetCodeVerified = true;
        await user.save();
    }
    async resetPassword(email, newPassword) {
        const user = await userModel_1.default.findOne({ email });
        // 1. Security Check: Ensure they actually verified the code first
        if (!user || !user.resetCodeVerified) {
            throw new apiError_1.default(400, "Please verify your reset code first");
        }
        // 2. Hash the new password and update the user
        user.password = await userUtils_1.default.hashPassword(newPassword);
        user.passwordChangedAt = new Date();
        // 3. Clean up the reset fields so they can't be reused
        user.resetCode = undefined;
        user.resetCodeExpires = undefined;
        user.resetCodeVerified = undefined;
        await user.save();
    }
}
exports.default = new AuthRepoImpl();
