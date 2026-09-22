import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import 'colors';

import GovernorateModel from '../../models/governorateModel';

dotenv.config({ path: path.resolve(__dirname, '../../../../../.env') });

const dataPath = path.join(__dirname, '../dummyData/governoratesDummyData.json');
const jsonGovernorates = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(process.env.DB_URI as string);
        console.log('Database connected for Governorate Seeder'.bgBlue);
    } catch (error) {
        console.log('Database connection error:'.red, error);
        process.exit(1);
    }
};

export const destroyGovernorates = async () => {
    try {
        await connectDB();
        await GovernorateModel.deleteMany();
        console.log('Governorates destroyed successfully'.bgRed);
        process.exit();
    } catch (error) {
        console.log('Error destroying governorates:'.red, error);
        process.exit(1);
    }
};

export const seedGovernorates = async () => {
    try {
        await connectDB();
        await GovernorateModel.insertMany(jsonGovernorates);
        console.log('Governorates seeded successfully'.bgGreen);
        process.exit();
    } catch (error) {
        console.log('Error seeding governorates:'.red, error);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyGovernorates();
} else if (process.argv[2] === '-i') {
    seedGovernorates();
}
