import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import 'colors';

import NotificationModel from '../../models/notificationModel';
import UserModel from '../../models/userModel'; // Adjust to your User model path

dotenv.config({ path: path.resolve(__dirname, '../../../../../.env') });

const dataPath = path.join(__dirname, '../dummyData/notificationsDummyData.json');
const jsonNotifications = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(process.env.DB_URI as string);
        console.log('Database connected for Notification Seeder'.bgBlue);
    } catch (error) {
        console.log('Database connection error:'.red, error);
        process.exit(1);
    }
};

export const destroyNotifications = async () => {
    try {
        await connectDB();
        await NotificationModel.deleteMany();
        console.log('Notifications destroyed successfully'.bgRed);
        process.exit();
    } catch (error) {
        console.log('Error destroying notifications:'.red, error);
        process.exit(1);
    }
};

export const seedNotifications = async () => {
    try {
        await connectDB();

        // Find an existing user or fallback to a generated ObjectId
        const existingUser = await UserModel.findOne();
        const fallbackUserId = existingUser ? existingUser._id : new mongoose.Types.ObjectId();

        const notificationsWithUser = jsonNotifications.map((notification: any) => ({
            ...notification,
            userId: notification.userId || fallbackUserId,
        }));

        await NotificationModel.insertMany(notificationsWithUser);
        console.log('Notifications seeded successfully'.bgGreen);
        process.exit();
    } catch (error) {
        console.log('Error seeding notifications:'.red, error);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyNotifications();
} else if (process.argv[2] === '-i') {
    seedNotifications();
}