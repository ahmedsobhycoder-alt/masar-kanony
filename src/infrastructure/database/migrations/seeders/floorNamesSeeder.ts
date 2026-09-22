import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import 'colors';

import FloorNameModel from '../../models/floorNameModel';

dotenv.config({ path: path.resolve(__dirname, '../../../../../.env') });

const dataPath = path.join(__dirname, '../dummyData/floorNamesDummyData.json');
const jsonFloorNames = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(process.env.DB_URI as string);
        console.log('Database connected for Floor Name Seeder'.bgBlue);
    } catch (error) {
        console.log('Database connection error:'.red, error);
        process.exit(1);
    }
};

export const destroyFloorNames = async () => {
    try {
        await connectDB();
        await FloorNameModel.deleteMany();
        console.log('Floor names destroyed successfully'.bgRed);
        process.exit();
    } catch (error) {
        console.log('Error destroying floor names:'.red, error);
        process.exit(1);
    }
};

export const seedFloorNames = async () => {
    try {
        await connectDB();
        await FloorNameModel.insertMany(jsonFloorNames);
        console.log('Floor names seeded successfully'.bgGreen);
        process.exit();
    } catch (error) {
        console.log('Error seeding floor names:'.red, error);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyFloorNames();
} else if (process.argv[2] === '-i') {
    seedFloorNames();
}
