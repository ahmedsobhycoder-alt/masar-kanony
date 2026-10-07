"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAppPolicies = exports.destroyAppPolicies = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
require("colors");
const appPolicyModel_1 = __importDefault(require("../../models/appPolicyModel"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../../../.env') });
const dataPath = path_1.default.join(__dirname, '../dummyData/appPolicyDummyData.json');
const jsonAppPolicies = JSON.parse(fs_1.default.readFileSync(dataPath, 'utf-8'));
const connectDB = async () => {
    if (mongoose_1.default.connection.readyState >= 1)
        return;
    try {
        await mongoose_1.default.connect(process.env.DB_URI);
        console.log('Database connected for App Policy Seeder'.bgBlue);
    }
    catch (error) {
        console.log('Database connection error:'.red, error);
        process.exit(1);
    }
};
const destroyAppPolicies = async () => {
    try {
        await connectDB();
        await appPolicyModel_1.default.deleteMany();
        console.log('App policies destroyed successfully'.bgRed);
        process.exit();
    }
    catch (error) {
        console.log('Error destroying app policies:'.red, error);
        process.exit(1);
    }
};
exports.destroyAppPolicies = destroyAppPolicies;
const seedAppPolicies = async () => {
    try {
        await connectDB();
        await appPolicyModel_1.default.insertMany(jsonAppPolicies);
        console.log('App policies seeded successfully'.bgGreen);
        process.exit();
    }
    catch (error) {
        console.log('Error seeding app policies:'.red, error);
        process.exit(1);
    }
};
exports.seedAppPolicies = seedAppPolicies;
if (process.argv[2] === '-d') {
    (0, exports.destroyAppPolicies)();
}
else if (process.argv[2] === '-i') {
    (0, exports.seedAppPolicies)();
}
