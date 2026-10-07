"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedCourts = exports.destroyCourts = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
require("colors");
const courtModel_1 = __importDefault(require("../../models/courtModel"));
const printColors_1 = require("../../../../shared/utils/printColors");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../../../.env') });
const dataPath = path_1.default.join(__dirname, '../dummyData/courtsDummyData.json');
const jsonCourts = JSON.parse(fs_1.default.readFileSync(dataPath, 'utf-8'));
const connectDB = async () => {
    if (mongoose_1.default.connection.readyState >= 1)
        return;
    try {
        await mongoose_1.default.connect(process.env.DB_URI);
        (0, printColors_1.printBlue)('Database connected for Court Seeder', process.env.DB_URI);
    }
    catch (error) {
        console.log('Database connection error:'.red, error);
        process.exit(1);
    }
};
const destroyCourts = async () => {
    try {
        await connectDB();
        await courtModel_1.default.deleteMany();
        console.log('Courts destroyed successfully'.bgRed);
        process.exit();
    }
    catch (error) {
        console.log('Error destroying courts:'.red, error);
        process.exit(1);
    }
};
exports.destroyCourts = destroyCourts;
const seedCourts = async () => {
    try {
        await connectDB();
        await courtModel_1.default.insertMany(jsonCourts);
        console.log('Courts seeded successfully'.bgGreen);
        process.exit();
    }
    catch (error) {
        console.log('Error seeding courts:'.red, error);
        process.exit(1);
    }
};
exports.seedCourts = seedCourts;
if (process.argv[2] === '-d') {
    (0, exports.destroyCourts)();
}
else if (process.argv[2] === '-i') {
    (0, exports.seedCourts)();
}
