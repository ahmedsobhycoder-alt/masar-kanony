"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = connectToDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
// import dns from 'node:dns';
// dns.setServers(['8.8.8.8', '8.8.4.4']); // Overrides your ISP DNS with Google DNS
async function connectToDatabase() {
    const dbUri = process.env.DB_URI || '';
    console.log(dbUri);
    try {
        await mongoose_1.default.connect(dbUri);
        console.log('Connected to MongoDB');
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}
