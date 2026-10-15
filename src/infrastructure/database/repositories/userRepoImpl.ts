import UserEntity from "../../../domain/entities/userEntity";
import UserRepo from "../../../domain/repositories/userRepo";
import UserModel from "../models/userModel";
import { QueryBuilder } from "../../../shared/utils/queryBuilder";
import listType from "../../../shared/constants/types";
import UserUtils from "src/shared/utils/userUtils";
import { sendAuthEmail } from "src/infrastructure/services/emailService";
import { HydratedDocument } from "mongoose";
import { throwError } from "src/shared/utils/helpers";

class UserRepoImpl implements UserRepo {


    async updateUser(user: HydratedDocument<UserEntity>, body: Record<string, any>): Promise<UserEntity | null> {

        if (body.email) {
            const otp = UserUtils.generateOTP();
            const hashedOtp = UserUtils.hashOtp(otp);
            user.pendingEmail = body.email;
            user.emailChangeOtp = hashedOtp;
            user.emailChangeOtpExpires = new Date(Date.now() + 10 * 60 * 1000);

        }

        const savedUser = await user.save({ validateModifiedOnly: true });
        const plainUser = savedUser.toObject(); // Plain JS object, identical to what lean() produces
        if (body.email) {
            await sendAuthEmail({
                toEmail: body.email,
                subject: "Confirm your new email address",
                text: `Your verification code is: ${user.emailChangeOtp}. It expires in 10 minutes.`,
            });
        }
        return savedUser;
    }
    async verifyEmailChange(user: HydratedDocument<UserEntity>, otp: string): Promise<UserEntity | null> {

        const conflict = await UserModel.findOne({ email: user.pendingEmail });
        if (conflict) {
            throwError(400, "This email was taken by another user during verification");
        }

        // 5. Transfer pendingEmail to real email and clear temporary fields
        user.email = user.pendingEmail!;
        user.pendingEmail = undefined;
        user.emailChangeOtp = undefined;
        user.emailChangeOtpExpires = undefined;
       return await user.save();
    }

    async getUsers(query: Record<string, any> = {}): Promise<listType<UserEntity>> {
        return await new QueryBuilder<UserEntity>(UserModel, query)
            .filter()
            .sort()
            .limitFields()
            .paginate()
            .execute();
    }

    async getUserById(id: string): Promise<UserEntity | null> {
        const user = await UserModel.findById(id).select("-password").lean();
        return user ? (user as UserEntity) : null;
    }

    async deleteUserById(id: string): Promise<UserEntity | null> {
        const user = await UserModel.findByIdAndDelete(id).select("-password");
        return user ? (user.toJSON() as UserEntity) : null;
    }
}

const userRepoImpl = new UserRepoImpl();
export default userRepoImpl;
export { UserRepoImpl };
