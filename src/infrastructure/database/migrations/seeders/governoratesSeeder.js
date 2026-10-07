"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedGovernorates = exports.destroyGovernorates = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
require("colors");
const governorateModel_1 = __importDefault(require("../../models/governorateModel"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../../../.env') });
const dataPath = path_1.default.join(__dirname, '../dummyData/governoratesDummyData.json');
const jsonGovernorates = JSON.parse(fs_1.default.readFileSync(dataPath, 'utf-8'));
const connectDB = async () => {
    if (mongoose_1.default.connection.readyState >= 1)
        return;
    try {
        await mongoose_1.default.connect(process.env.DB_URI);
        console.log('Database connected for Governorate Seeder'.bgBlue);
    }
    catch (error) {
        console.log('Database connection error:'.red, error);
        process.exit(1);
    }
};
const destroyGovernorates = async () => {
    try {
        await connectDB();
        await governorateModel_1.default.deleteMany();
        console.log('Governorates destroyed successfully'.bgRed);
        process.exit();
    }
    catch (error) {
        console.log('Error destroying governorates:'.red, error);
        process.exit(1);
    }
};
exports.destroyGovernorates = destroyGovernorates;
const seedGovernorates = async () => {
    try {
        await connectDB();
        await governorateModel_1.default.insertMany(jsonGovernorates);
        console.log('Governorates seeded successfully'.bgGreen);
        process.exit();
    }
    catch (error) {
        console.log('Error seeding governorates:'.red, error);
        process.exit(1);
    }
};
exports.seedGovernorates = seedGovernorates;
if (process.argv[2] === '-d') {
    (0, exports.destroyGovernorates)();
}
else if (process.argv[2] === '-i') {
    (0, exports.seedGovernorates)();
}
