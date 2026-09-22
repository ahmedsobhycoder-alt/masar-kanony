import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import 'colors';

import FloorModel from '../../models/floorModel';
import CourtModel from '../../models/courtModel';
import FloorNameModel from '../../models/floorNameModel';

dotenv.config({ path: path.resolve(__dirname, '../../../../../.env') });

const dataPath = path.join(__dirname, '../dummyData/floorsDummyData.json');
const jsonFloors = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(process.env.DB_URI as string);
        console.log('Database connected for Floor Seeder'.bgBlue);
    } catch (error) {
        console.log('Database connection error:'.red, error);
        process.exit(1);
    }
};

export const destroyFloors = async () => {
    try {
        await connectDB();
        await FloorModel.deleteMany();
        console.log('Floors destroyed successfully'.bgRed);
        process.exit();
    } catch (error) {
        console.log('Error destroying floors:'.red, error);
        process.exit(1);
    }
};

export const seedFloors = async () => {
    try {
        await connectDB();

        const courts = await CourtModel.find().lean();
        const floorNames = await FloorNameModel.find().lean();

        const mappedFloors = jsonFloors.map((floor: any, index: number) => ({
            ...floor,
            court: courts[index % courts.length]?._id,
            floorName: floorNames[index % floorNames.length]?._id,
        }));

        await FloorModel.insertMany(mappedFloors);
        console.log('Floors seeded successfully'.bgGreen);
        process.exit();
    } catch (error) {
        console.log('Error seeding floors:'.red, error);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyFloors();
} else if (process.argv[2] === '-i') {
    seedFloors();
}
