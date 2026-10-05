import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import 'colors';

import UserModel from '../../models/userModel';

dotenv.config({ path: path.resolve(__dirname, '../../../../../.env') });

const dataPath = path.join(__dirname, '../dummyData/usersDummyData.json');
const jsonUsers = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(process.env.DB_URI as string);
        console.log('Database connected for User Seeder'.bgBlue);
    } catch (error) {
        console.log('Database connection error:'.red, error);
        process.exit(1);
    }
};

export const destroyUsers = async () => {
    try {
        await connectDB();
        await UserModel.deleteMany();
        console.log('Users destroyed successfully'.bgRed);
        process.exit();
    } catch (error) {
        console.log('Error destroying users:'.red, error);
        process.exit(1);
    }
};

export const seedUsers = async () => {
    try {
        await connectDB();
        await UserModel.insertMany(jsonUsers);
        console.log('Users seeded successfully'.bgGreen);
        process.exit();
    } catch (error) {
        console.log('Error seeding users:'.red, error);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyUsers();
} else if (process.argv[2] === '-i') {
    seedUsers();
}
