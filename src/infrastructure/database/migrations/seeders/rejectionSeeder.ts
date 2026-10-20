import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import 'colors';

import RejectionModel from '../../models/rejectionModel';

dotenv.config({ path: path.resolve(__dirname, '../../../../../.env') });

const dataPath = path.join(__dirname, '../dummyData/rejectionDummyData.json');
const jsonRejections = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(process.env.DB_URI as string);
        console.log('Database connected for Rejection Seeder'.bgBlue);
    } catch (error) {
        console.log('Database connection error:'.red, error);
        process.exit(1);
    }
};

export const destroyRejections = async () => {
    try {
        await connectDB();
        await RejectionModel.deleteMany();
        console.log('Rejections destroyed successfully'.bgRed);
        process.exit();
    } catch (error) {
        console.log('Error destroying rejections:'.red, error);
        process.exit(1);
    }
};

export const seedRejections = async () => {
    try {
        await connectDB();
        await RejectionModel.insertMany(jsonRejections);
        console.log('Rejections seeded successfully'.bgGreen);
        process.exit();
    } catch (error) {
        console.log('Error seeding rejections:'.red, error);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyRejections();
} else if (process.argv[2] === '-i') {
    seedRejections();
}