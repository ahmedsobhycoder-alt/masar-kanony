"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedUsers = exports.destroyUsers = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
require("colors");
const userModel_1 = __importDefault(require("../../models/userModel"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../../../.env') });
const dataPath = path_1.default.join(__dirname, '../dummyData/usersDummyData.json');
const jsonUsers = JSON.parse(fs_1.default.readFileSync(dataPath, 'utf-8'));
const connectDB = async () => {
    if (mongoose_1.default.connection.readyState >= 1)
        return;
    try {
        await mongoose_1.default.connect(process.env.DB_URI);
        console.log('Database connected for User Seeder'.bgBlue);
    }
    catch (error) {
        console.log('Database connection error:'.red, error);
        process.exit(1);
    }
};
const destroyUsers = async () => {
    try {
        await connectDB();
        await userModel_1.default.deleteMany();
        console.log('Users destroyed successfully'.bgRed);
        process.exit();
    }
    catch (error) {
        console.log('Error destroying users:'.red, error);
        process.exit(1);
    }
};
exports.destroyUsers = destroyUsers;
const seedUsers = async () => {
    try {
        await connectDB();
        await userModel_1.default.insertMany(jsonUsers);
        console.log('Users seeded successfully'.bgGreen);
        process.exit();
    }
    catch (error) {
        console.log('Error seeding users:'.red, error);
        process.exit(1);
    }
};
exports.seedUsers = seedUsers;
if (process.argv[2] === '-d') {
    (0, exports.destroyUsers)();
}
else if (process.argv[2] === '-i') {
    (0, exports.seedUsers)();
}
