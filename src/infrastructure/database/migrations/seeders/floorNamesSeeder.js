"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedFloorNames = exports.destroyFloorNames = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
require("colors");
const floorNameModel_1 = __importDefault(require("../../models/floorNameModel"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../../../.env') });
const dataPath = path_1.default.join(__dirname, '../dummyData/floorNamesDummyData.json');
const jsonFloorNames = JSON.parse(fs_1.default.readFileSync(dataPath, 'utf-8'));
const connectDB = async () => {
    if (mongoose_1.default.connection.readyState >= 1)
        return;
    try {
        await mongoose_1.default.connect(process.env.DB_URI);
        console.log('Database connected for Floor Name Seeder'.bgBlue);
    }
    catch (error) {
        console.log('Database connection error:'.red, error);
        process.exit(1);
    }
};
const destroyFloorNames = async () => {
    try {
        await connectDB();
        await floorNameModel_1.default.deleteMany();
        console.log('Floor names destroyed successfully'.bgRed);
        process.exit();
    }
    catch (error) {
        console.log('Error destroying floor names:'.red, error);
        process.exit(1);
    }
};
exports.destroyFloorNames = destroyFloorNames;
const seedFloorNames = async () => {
    try {
        await connectDB();
        await floorNameModel_1.default.insertMany(jsonFloorNames);
        console.log('Floor names seeded successfully'.bgGreen);
        process.exit();
    }
    catch (error) {
        console.log('Error seeding floor names:'.red, error);
        process.exit(1);
    }
};
exports.seedFloorNames = seedFloorNames;
if (process.argv[2] === '-d') {
    (0, exports.destroyFloorNames)();
}
else if (process.argv[2] === '-i') {
    (0, exports.seedFloorNames)();
}
