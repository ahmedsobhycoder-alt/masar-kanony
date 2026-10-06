import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import 'colors';

import PaymentModel from '../../models/paymentModel';

dotenv.config({ path: path.resolve(__dirname, '../../../../../.env') });

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(process.env.DB_URI as string);
        console.log('Database connected for Payment Seeder'.bgBlue);
    } catch (error) {
        console.log('Database connection error:'.red, error);
        process.exit(1);
    }
};

export const destroyPayments = async () => {
    try {
        await connectDB();
        await PaymentModel.deleteMany();
        console.log('Payments destroyed successfully'.bgRed);
        process.exit();
    } catch (error) {
        console.log('Error destroying payments:'.red, error);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyPayments();
}