import UserModel
    from "../models/userModel";
import AuthRepo from "../../../domain/repositories/authRepo";
import UserEntity from "../../../domain/entities/userEntity";
import { sendAuthEmail } from "../../services/emailService";
import UserUtils from "../../../shared/utils/userUtils";
import OtpModel from "../models/otpModel";
import { printGreen, printYellow } from "../../../shared/utils/printColors";
import ApiError from "../../../shared/errors/apiError";
import RevokedTokenModel from "../models/revokedTokenModel";
import jwt from "jsonwebtoken";
class AuthRepoImpl implements AuthRepo {
   

    async signup(userData: UserEntity): Promise<void> {
        // 2. Generate the OTP
        const otp = UserUtils.generateOTP();

        // 3. Save to a temporary OTP collection (with a 10-minute TTL index)
        // We do NOT call UserModel.create() here.
        await OtpModel.create({
            email: userData.email,
            otp: otp,
            pendingUserData: userData // Store their password/name temporarily
        });
        // 4. Send the email
        await sendAuthEmail(userData.email, otp);

    }


    async verify(email: string, otp: string): Promise<{
        user: UserEntity;
        token: string;
    }> {
        // 1. Check if the OTP matches and hasn't expired (MongoDB handles the 10-min expiration automatically)
        const otpRecord = await OtpModel.findOne({ email, otp });
        if (!otpRecord) {
            throw new ApiError(400, "Invalid or expired verification code");
        }

        // 2. Extract the pending user data we saved during signup
        const userData = otpRecord.pendingUserData;

        // 3. Mark the user as verified before saving
        userData.verified = true;

        // 4. Create the official user in the main database
        const newUser = await UserModel.create(userData);

        // 5. Delete the OTP record so it cannot be used again
        await OtpModel.deleteOne({ _id: otpRecord._id });

        // 6. Generate the authentication token
        const token = UserUtils.createToken({
            id: newUser._id,
            role: newUser.role
        });

        return {
            user: newUser,
            token
        };
    }

    async login(email: string, password: string): Promise<{
        user: UserEntity;
        token: string;
    }> {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new ApiError(400, "Invalid email");
        }
        if (!user.password) {
            throw new ApiError(400, "User account password is not set");
        }
        printGreen("email",`User found: ${user.email}, ID: ${user._id}`);
        printGreen("hased password",`Password provided: ${user.password}`);
        const isPasswordCorrect = await UserUtils.comparePassword(
            password, user.password);
        if (!isPasswordCorrect) {
            throw new ApiError(400, "Invalid  password");
        }
        const token = UserUtils.createToken({
            id: user._id,
            role: user.role
        })

        return {
            user,
            token
        };
    }

    async forgetPassword(email: string): Promise<void> {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new ApiError(400, "User not found");
        }
        const otp = UserUtils.generateOTP();
        user.resetCode = otp;
        user.resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
        user.resetCodeVerified = false;
        await user.save();
        await sendAuthEmail(email, otp);
    }
    async verifyResetCode(email: string, resetCode: string): Promise<void> {
        // 1. Find user by email, matching reset code, ensuring the code hasn't expired
        const user = await UserModel.findOne({
            email,
            resetCode,
            resetCodeExpires: { $gt: Date.now() }
        });

        if (!user) {
            throw new ApiError(400, "Invalid or expired reset code");
        }

        // 2. Mark the reset code as verified so they can proceed to choose a new password
        user.resetCodeVerified = true;
        await user.save();

    }
    async resetPassword(email: string, newPassword: string): Promise<void> {
        const user = await UserModel.findOne({ email });

        // 1. Security Check: Ensure they actually verified the code first
        if (!user || !user.resetCodeVerified) {
            throw new ApiError(400, "Please verify your reset code first");
        }

        // 2. Hash the new password and update the user
        user.password = await UserUtils.hashPassword(newPassword);
        user.passwordChangedAt = new Date();

        // 3. Clean up the reset fields so they can't be reused
        user.resetCode = undefined;
        user.resetCodeExpires = undefined;
        user.resetCodeVerified = undefined;

        await user.save();
    }
    async logout(token: string): Promise<void> {
        const decoded = jwt.decode(token);
        if (!decoded || typeof decoded === "string" || !decoded.exp) {
            throw new ApiError(400, "Invalid token");
        }

        await RevokedTokenModel.create({
            tokenHash: UserUtils.hashToken(token),
            expiresAt: new Date(decoded.exp * 1000),
        });
    }
}

export default new AuthRepoImpl();