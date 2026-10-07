"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedOffices = exports.destroyOffices = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
require("colors");
const officeModel_1 = __importDefault(require("../../models/officeModel"));
const floorModel_1 = __importDefault(require("../../models/floorModel"));
const courtModel_1 = __importDefault(require("../../models/courtModel"));
const officeTypeModel_1 = __importDefault(require("../../models/officeTypeModel"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../../../.env') });
const dataPath = path_1.default.join(__dirname, '../dummyData/officesDummyData.json');
const jsonOffices = JSON.parse(fs_1.default.readFileSync(dataPath, 'utf-8'));
const connectDB = async () => {
    if (mongoose_1.default.connection.readyState >= 1)
        return;
    try {
        await mongoose_1.default.connect(process.env.DB_URI);
        console.log('Database connected for Office Seeder'.bgBlue);
    }
    catch (error) {
        console.log('Database connection error:'.red, error);
        process.exit(1);
    }
};
const destroyOffices = async () => {
    try {
        await connectDB();
        await officeModel_1.default.deleteMany();
        console.log('Offices destroyed successfully'.bgRed);
        process.exit();
    }
    catch (error) {
        console.log('Error destroying offices:'.red, error);
        process.exit(1);
    }
};
exports.destroyOffices = destroyOffices;
const seedOffices = async () => {
    try {
        await connectDB();
        const floors = await floorModel_1.default.find().lean();
        const courts = await courtModel_1.default.find().lean();
        const officeTypes = await officeTypeModel_1.default.find().lean();
        const mappedOffices = jsonOffices.map((office, index) => ({
            ...office,
            floor: floors[index % floors.length]?._id,
            court: courts[index % courts.length]?._id,
            officeType: officeTypes[index % officeTypes.length]?._id,
        }));
        await officeModel_1.default.insertMany(mappedOffices);
        console.log('Offices seeded successfully'.bgGreen);
        process.exit();
    }
    catch (error) {
        console.log('Error seeding offices:'.red, error);
        process.exit(1);
    }
};
exports.seedOffices = seedOffices;
if (process.argv[2] === '-d') {
    (0, exports.destroyOffices)();
}
else if (process.argv[2] === '-i') {
    (0, exports.seedOffices)();
}
