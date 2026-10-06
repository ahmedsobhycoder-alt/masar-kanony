import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import 'colors';

import AppPolicyModel from '../../models/appPolicyModel';

dotenv.config({ path: path.resolve(__dirname, '../../../../../.env') });

const dataPath = path.join(__dirname, '../dummyData/appPolicyDummyData.json');
const jsonAppPolicies = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(process.env.DB_URI as string);
        console.log('Database connected for App Policy Seeder'.bgBlue);
    } catch (error) {
        console.log('Database connection error:'.red, error);
        process.exit(1);
    }
};

export const destroyAppPolicies = async () => {
    try {
        await connectDB();
        await AppPolicyModel.deleteMany();
        console.log('App policies destroyed successfully'.bgRed);
        process.exit();
    } catch (error) {
        console.log('Error destroying app policies:'.red, error);
        process.exit(1);
    }
};

export const seedAppPolicies = async () => {
    try {
        await connectDB();
        await AppPolicyModel.insertMany(jsonAppPolicies);
        console.log('App policies seeded successfully'.bgGreen);
        process.exit();
    } catch (error) {
        console.log('Error seeding app policies:'.red, error);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyAppPolicies();
} else if (process.argv[2] === '-i') {
    seedAppPolicies();
}