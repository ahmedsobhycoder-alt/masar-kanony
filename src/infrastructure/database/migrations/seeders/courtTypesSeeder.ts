import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import 'colors';

import CourtTypeModel from '../../models/courtTypeModel';

dotenv.config({ path: path.resolve(__dirname, '../../../../../.env') });

const dataPath = path.join(__dirname, '../dummyData/courtTypesDummyData.json');
const jsonCourtTypes = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(process.env.DB_URI as string);
        console.log('Database connected for Court Type Seeder'.bgBlue);
    } catch (error) {
        console.log('Database connection error:'.red, error);
        process.exit(1);
    }
};

export const destroyCourtTypes = async () => {
    try {
        await connectDB();
        await CourtTypeModel.deleteMany();
        console.log('Court types destroyed successfully'.bgRed);
        process.exit();
    } catch (error) {
        console.log('Error destroying court types:'.red, error);
        process.exit(1);
    }
};

export const seedCourtTypes = async () => {
    try {
        await connectDB();
        await CourtTypeModel.insertMany(jsonCourtTypes);
        console.log('Court types seeded successfully'.bgGreen);
        process.exit();
    } catch (error) {
        console.log('Error seeding court types:'.red, error);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyCourtTypes();
} else if (process.argv[2] === '-i') {
    seedCourtTypes();
}
