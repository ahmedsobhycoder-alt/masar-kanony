"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroyPayments = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
require("colors");
const paymentModel_1 = __importDefault(require("../../models/paymentModel"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../../../.env') });
const connectDB = async () => {
    if (mongoose_1.default.connection.readyState >= 1)
        return;
    try {
        await mongoose_1.default.connect(process.env.DB_URI);
        console.log('Database connected for Payment Seeder'.bgBlue);
    }
    catch (error) {
        console.log('Database connection error:'.red, error);
        process.exit(1);
    }
};
const destroyPayments = async () => {
    try {
        await connectDB();
        await paymentModel_1.default.deleteMany();
        console.log('Payments destroyed successfully'.bgRed);
        process.exit();
    }
    catch (error) {
        console.log('Error destroying payments:'.red, error);
        process.exit(1);
    }
};
exports.destroyPayments = destroyPayments;
if (process.argv[2] === '-d') {
    (0, exports.destroyPayments)();
}
