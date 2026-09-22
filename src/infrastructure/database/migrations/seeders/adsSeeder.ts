import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import 'colors';

import AdsModel from '../../models/adsModel';

dotenv.config({ path: path.resolve(__dirname, '../../../../../.env') });

const dataPath = path.join(__dirname, '../dummyData/adsDunmyData.json');
const jsonAds = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(process.env.DB_URI as string);
        console.log('Database connected for Ads Seeder'.bgBlue);
    } catch (error) {
        console.log('Database connection error:'.red, error);
        process.exit(1);
    }
};

export const destroyAds = async () => {
    try {
        await connectDB();
        await AdsModel.deleteMany();
        console.log('Ads destroyed successfully'.bgRed);
        process.exit();
    } catch (error) {
        console.log('Error destroying ads:'.red, error);
        process.exit(1);
    }
};

export const seedAds = async () => {
    try {
        await connectDB();
        await AdsModel.insertMany(jsonAds);
        console.log('Ads seeded successfully'.bgGreen);
        process.exit();
    } catch (error) {
        console.log('Error seeding ads:'.red, error);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyAds();
} else if (process.argv[2] === '-i') {
    seedAds();
}
