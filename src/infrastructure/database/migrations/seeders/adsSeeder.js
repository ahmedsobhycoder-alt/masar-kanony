"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAds = exports.destroyAds = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
require("colors");
const adsModel_1 = __importDefault(require("../../models/adsModel"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../../../.env') });
const dataPath = path_1.default.join(__dirname, '../dummyData/adsDunmyData.json');
const jsonAds = JSON.parse(fs_1.default.readFileSync(dataPath, 'utf-8'));
const connectDB = async () => {
    if (mongoose_1.default.connection.readyState >= 1)
        return;
    try {
        await mongoose_1.default.connect(process.env.DB_URI);
        console.log('Database connected for Ads Seeder'.bgBlue);
    }
    catch (error) {
        console.log('Database connection error:'.red, error);
        process.exit(1);
    }
};
const destroyAds = async () => {
    try {
        await connectDB();
        await adsModel_1.default.deleteMany();
        console.log('Ads destroyed successfully'.bgRed);
        process.exit();
    }
    catch (error) {
        console.log('Error destroying ads:'.red, error);
        process.exit(1);
    }
};
exports.destroyAds = destroyAds;
const seedAds = async () => {
    try {
        await connectDB();
        await adsModel_1.default.insertMany(jsonAds);
        console.log('Ads seeded successfully'.bgGreen);
        process.exit();
    }
    catch (error) {
        console.log('Error seeding ads:'.red, error);
        process.exit(1);
    }
};
exports.seedAds = seedAds;
if (process.argv[2] === '-d') {
    (0, exports.destroyAds)();
}
else if (process.argv[2] === '-i') {
    (0, exports.seedAds)();
}
