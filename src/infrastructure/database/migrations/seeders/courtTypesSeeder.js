"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedCourtTypes = exports.destroyCourtTypes = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
require("colors");
const courtTypeModel_1 = __importDefault(require("../../models/courtTypeModel"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../../../.env') });
const dataPath = path_1.default.join(__dirname, '../dummyData/courtTypesDummyData.json');
const jsonCourtTypes = JSON.parse(fs_1.default.readFileSync(dataPath, 'utf-8'));
const connectDB = async () => {
    if (mongoose_1.default.connection.readyState >= 1)
        return;
    try {
        await mongoose_1.default.connect(process.env.DB_URI);
        console.log('Database connected for Court Type Seeder'.bgBlue);
    }
    catch (error) {
        console.log('Database connection error:'.red, error);
        process.exit(1);
    }
};
const destroyCourtTypes = async () => {
    try {
        await connectDB();
        await courtTypeModel_1.default.deleteMany();
        console.log('Court types destroyed successfully'.bgRed);
        process.exit();
    }
    catch (error) {
        console.log('Error destroying court types:'.red, error);
        process.exit(1);
    }
};
exports.destroyCourtTypes = destroyCourtTypes;
const seedCourtTypes = async () => {
    try {
        await connectDB();
        await courtTypeModel_1.default.insertMany(jsonCourtTypes);
        console.log('Court types seeded successfully'.bgGreen);
        process.exit();
    }
    catch (error) {
        console.log('Error seeding court types:'.red, error);
        process.exit(1);
    }
};
exports.seedCourtTypes = seedCourtTypes;
if (process.argv[2] === '-d') {
    (0, exports.destroyCourtTypes)();
}
else if (process.argv[2] === '-i') {
    (0, exports.seedCourtTypes)();
}
