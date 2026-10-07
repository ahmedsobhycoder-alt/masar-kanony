"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAuthEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const printColors_1 = require("../../shared/utils/printColors");
// 2. Create a reusable send function
const sendAuthEmail = async (toEmail, verificationCode) => {
    (0, printColors_1.printGreen)("to", `Sending authentication email to ${toEmail}`);
    (0, printColors_1.printGreen)("code", `Verification code: ${verificationCode}`);
    (0, printColors_1.printGreen)("pass", `Email password: ${process.env.EMAIL_PASSWORD}`);
    try {
        // 1) Create transporter ( service that will send email like "gmail","Mailgun", "mialtrap", sendGrid)
        const transporter = nodemailer_1.default.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT, // this the port the will listen to the email
            secure: true, //  if secure true , use  port 465. if secure false , use port 587 
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        const mailOptions = {
            from: `"Masar-kanony Security" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: 'Your Authentication Code',
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Welcome to Dawar</h2>
            <p>Your verification code is: <strong>${verificationCode}</strong></p>
            <p style="color: #555; font-size: 12px;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
        </div>
    `,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${toEmail}: ${info.messageId}`);
    }
    catch (error) {
        console.error('Error sending authentication email:', error);
        // Throw the error so your controller can handle it and return a 500 status to the user
        throw new Error('Could not send authentication email');
    }
};
exports.sendAuthEmail = sendAuthEmail;
