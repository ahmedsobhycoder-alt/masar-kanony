import nodemailer from 'nodemailer';
import { printGreen } from '../../shared/utils/printColors';



// 2. Create a reusable send function
export const sendAuthEmail = async (toEmail: string, verificationCode: string) => {
    printGreen("to", `Sending authentication email to ${toEmail}`);
    printGreen("code", `Verification code: ${verificationCode}`);
    printGreen("pass", `Email password: ${process.env.EMAIL_PASSWORD}`);

    try {
        // 1) Create transporter ( service that will send email like "gmail","Mailgun", "mialtrap", sendGrid)
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT, // this the port the will listen to the email
            secure: true, //  if secure true , use  port 465. if secure false , use port 587 
            auth: {  //my email
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

    } catch (error) {
        console.error('Error sending authentication email:', error);
        // Throw the error so your controller can handle it and return a 500 status to the user
        throw new Error('Could not send authentication email');
    }
};