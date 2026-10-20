interface UserEntity {
    id: string;
    _id: string;
    name: string;
    phone: string;
    email: string;
    password?: string;
    profileImage: string;
    role: string;
    active: Boolean;
    passwordChangedAt?: Date,
    resetCode?: String,
    resetCodeExpires?: Date,
    otp: string,
    resetCodeVerified?: Boolean,
    verified: Boolean,
    isSubscribed: Boolean,
    currentsubscriptionStatus: String
    currentSubscriptionId: string;
    pendingEmail?: string,
    emailChangeOtp?: string, // Stored as a hashed string
    emailChangeOtpExpires?:  Date,
    fcmTokens:  [String]


}
export default UserEntity;