"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedOfficeTypes = exports.destroyOfficeTypes = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
require("colors");
const officeTypeModel_1 = __importDefault(require("../../models/officeTypeModel"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../../../.env') });
const dataPath = path_1.default.join(__dirname, '../dummyData/officeTypesDummyData.json');
const jsonOfficeTypes = JSON.parse(fs_1.default.readFileSync(dataPath, 'utf-8'));
const connectDB = async () => {
    if (mongoose_1.default.connection.readyState >= 1)
        return;
    try {
        await mongoose_1.default.connect(process.env.DB_URI);
        console.log('Database connected for Office Type Seeder'.bgBlue);
    }
    catch (error) {
        console.log('Database connection error:'.red, error);
        process.exit(1);
    }
};
const destroyOfficeTypes = async () => {
    try {
        await connectDB();
        await officeTypeModel_1.default.deleteMany();
        console.log('Office types destroyed successfully'.bgRed);
        process.exit();
    }
    catch (error) {
        console.log('Error destroying office types:'.red, error);
        process.exit(1);
    }
};
exports.destroyOfficeTypes = destroyOfficeTypes;
const seedOfficeTypes = async () => {
    try {
        await connectDB();
        await officeTypeModel_1.default.insertMany(jsonOfficeTypes);
        console.log('Office types seeded successfully'.bgGreen);
        process.exit();
    }
    catch (error) {
        console.log('Error seeding office types:'.red, error);
        process.exit(1);
    }
};
exports.seedOfficeTypes = seedOfficeTypes;
if (process.argv[2] === '-d') {
    (0, exports.destroyOfficeTypes)();
}
else if (process.argv[2] === '-i') {
    (0, exports.seedOfficeTypes)();
}
