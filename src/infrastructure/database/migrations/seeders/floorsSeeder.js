"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedFloors = exports.destroyFloors = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
require("colors");
const floorModel_1 = __importDefault(require("../../models/floorModel"));
const courtModel_1 = __importDefault(require("../../models/courtModel"));
const floorNameModel_1 = __importDefault(require("../../models/floorNameModel"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../../../.env') });
const dataPath = path_1.default.join(__dirname, '../dummyData/floorsDummyData.json');
const jsonFloors = JSON.parse(fs_1.default.readFileSync(dataPath, 'utf-8'));
const connectDB = async () => {
    if (mongoose_1.default.connection.readyState >= 1)
        return;
    try {
        await mongoose_1.default.connect(process.env.DB_URI);
        console.log('Database connected for Floor Seeder'.bgBlue);
    }
    catch (error) {
        console.log('Database connection error:'.red, error);
        process.exit(1);
    }
};
const destroyFloors = async () => {
    try {
        await connectDB();
        await floorModel_1.default.deleteMany();
        console.log('Floors destroyed successfully'.bgRed);
        process.exit();
    }
    catch (error) {
        console.log('Error destroying floors:'.red, error);
        process.exit(1);
    }
};
exports.destroyFloors = destroyFloors;
const seedFloors = async () => {
    try {
        await connectDB();
        const courts = await courtModel_1.default.find().lean();
        const floorNames = await floorNameModel_1.default.find().lean();
        const mappedFloors = jsonFloors.map((floor, index) => ({
            ...floor,
            court: courts[index % courts.length]?._id,
            floorName: floorNames[index % floorNames.length]?._id,
        }));
        await floorModel_1.default.insertMany(mappedFloors);
        console.log('Floors seeded successfully'.bgGreen);
        process.exit();
    }
    catch (error) {
        console.log('Error seeding floors:'.red, error);
        process.exit(1);
    }
};
exports.seedFloors = seedFloors;
if (process.argv[2] === '-d') {
    (0, exports.destroyFloors)();
}
else if (process.argv[2] === '-i') {
    (0, exports.seedFloors)();
}
