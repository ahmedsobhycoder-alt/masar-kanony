import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import 'colors';

import OfficesModel from '../../models/officeModel';
import FloorModel from '../../models/floorModel';
import CourtModel from '../../models/courtModel';
import OfficeTypeModel from '../../models/officeTypeModel';

dotenv.config({ path: path.resolve(__dirname, '../../../../../.env') });

const dataPath = path.join(__dirname, '../dummyData/officesDummyData.json');
const jsonOffices = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(process.env.DB_URI as string);
        console.log('Database connected for Office Seeder'.bgBlue);
    } catch (error) {
        console.log('Database connection error:'.red, error);
        process.exit(1);
    }
};

export const destroyOffices = async () => {
    try {
        await connectDB();
        await OfficesModel.deleteMany();
        console.log('Offices destroyed successfully'.bgRed);
        process.exit();
    } catch (error) {
        console.log('Error destroying offices:'.red, error);
        process.exit(1);
    }
};

export const seedOffices = async () => {
    try {
        await connectDB();

        const floors = await FloorModel.find().lean();
        const courts = await CourtModel.find().lean();
        const officeTypes = await OfficeTypeModel.find().lean();

        const mappedOffices = jsonOffices.map((office: any, index: number) => ({
            ...office,
            floor: floors[index % floors.length]?._id,
            court: courts[index % courts.length]?._id,
            officeType: officeTypes[index % officeTypes.length]?._id,
        }));

        await OfficesModel.insertMany(mappedOffices);
        console.log('Offices seeded successfully'.bgGreen);
        process.exit();
    } catch (error) {
        console.log('Error seeding offices:'.red, error);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyOffices();
} else if (process.argv[2] === '-i') {
    seedOffices();
}
