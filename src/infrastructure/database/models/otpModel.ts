import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true 
    },
    otp: { 
        type: String, 
        required: true 
    },
    // Using Mixed allows you to store the entire UserEntity object as a nested JSON object
    pendingUserData: { 
        type: mongoose.Schema.Types.Mixed, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now, 
        expires: 600 // 600 seconds = 10 minutes. MongoDB will auto-delete this document after 10 mins.
    }
});
const OtpModel = mongoose.model('Otp', otpSchema);
export default OtpModel;