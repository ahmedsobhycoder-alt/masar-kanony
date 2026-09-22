import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import 'colors';

import OfficeTypeModel from '../../models/officeTypeModel';

dotenv.config({ path: path.resolve(__dirname, '../../../../../.env') });

const dataPath = path.join(__dirname, '../dummyData/officeTypesDummyData.json');
const jsonOfficeTypes = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(process.env.DB_URI as string);
        console.log('Database connected for Office Type Seeder'.bgBlue);
    } catch (error) {
        console.log('Database connection error:'.red, error);
        process.exit(1);
    }
};

export const destroyOfficeTypes = async () => {
    try {
        await connectDB();
        await OfficeTypeModel.deleteMany();
        console.log('Office types destroyed successfully'.bgRed);
        process.exit();
    } catch (error) {
        console.log('Error destroying office types:'.red, error);
        process.exit(1);
    }
};

export const seedOfficeTypes = async () => {
    try {
        await connectDB();
        await OfficeTypeModel.insertMany(jsonOfficeTypes);
        console.log('Office types seeded successfully'.bgGreen);
        process.exit();
    } catch (error) {
        console.log('Error seeding office types:'.red, error);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyOfficeTypes();
} else if (process.argv[2] === '-i') {
    seedOfficeTypes();
}
