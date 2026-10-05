import mongoose, { Schema } from "mongoose";
import UserEntity from "../../../domain/entities/userEntity";
import UserUtils from "../../../shared/utils/userUtils";
import { printGreen } from "../../../shared/utils/printColors";
import UserRole from "../../../shared/constants/user-roles.enum";
const userSchema = new Schema<UserEntity>({
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
        default: UserRole.USER,
    },
    isSubscribed: {
        type: Boolean,
        default: false
    }


});
userSchema.pre("save", async function () {
  // Only hash the password if it has actually been modified (or is new)
  printGreen("password",`Password before hashing: ${this.password}`);
  if (!this.isModified("password")) return;
  printGreen("password",`Password after hashing: ${this.password}`);

  this.password = await UserUtils.hashPassword(this.password);
});

const UserModel = mongoose.model<UserEntity>("users", userSchema);
export default UserModel;