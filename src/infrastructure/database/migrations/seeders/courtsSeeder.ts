import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import 'colors';

import CourtModel from '../../models/courtModel';
import GovernorateModel from '../../models/governorateModel';
import CourtTypeModel from '../../models/courtTypeModel';
import { printBlue } from '../../../../shared/utils/printColors';

dotenv.config({ path: path.resolve(__dirname, '../../../../../.env') });

const dataPath = path.join(__dirname, '../dummyData/courtsDummyData.json');
const jsonCourts = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(process.env.DB_URI as string);
        printBlue('Database connected for Court Seeder',process.env.DB_URI );
    } catch (error) {
        console.log('Database connection error:'.red, error);
        process.exit(1);
    }
};

export const destroyCourts = async () => {
    try {
        await connectDB();
        await CourtModel.deleteMany();
        console.log('Courts destroyed successfully'.bgRed);
        process.exit();
    } catch (error) {
        console.log('Error destroying courts:'.red, error);
        process.exit(1);
    }
};

export const seedCourts = async () => {
    try {
        await connectDB();

        const governorates = await GovernorateModel.find().lean();
        const courtTypes = await CourtTypeModel.find().lean();

        const mappedCourts = jsonCourts.map((court: any, index: number) => ({
            ...court,
            governorate: governorates[index % governorates.length]?._id,
            courtType: courtTypes[index % courtTypes.length]?._id,
        }));

        await CourtModel.insertMany(mappedCourts);
        console.log('Courts seeded successfully'.bgGreen);
        process.exit();
    } catch (error) {
        console.log('Error seeding courts:'.red, error);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyCourts();
} else if (process.argv[2] === '-i') {
    seedCourts();
}
