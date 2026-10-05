interface UserEntity {
    name: string;
    phone: string;
    email: string;
    password: string;
    profileImage: string;
    role: string;
    active: Boolean;
    passwordChangedAt?: Date,
    resetCode?: String,
    resetCodeExpires?: Date,
    otp: String,
    resetCodeVerified?: Boolean,
    verified: Boolean,
    isSubscribed: Boolean
}
export default UserEntity;