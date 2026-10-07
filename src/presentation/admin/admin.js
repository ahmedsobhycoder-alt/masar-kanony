"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminRouter = void 0;
const courtModel_1 = __importDefault(require("../../infrastructure/database/models/courtModel"));
const courtTypeModel_1 = __importDefault(require("../../infrastructure/database/models/courtTypeModel"));
const floorNameModel_1 = __importDefault(require("../../infrastructure/database/models/floorNameModel"));
const governorateModel_1 = __importDefault(require("../../infrastructure/database/models/governorateModel"));
const officeTypeModel_1 = __importDefault(require("../../infrastructure/database/models/officeTypeModel"));
const userModel_1 = __importDefault(require("../../infrastructure/database/models/userModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const resources = [
    {
        resource: userModel_1.default,
        options: {
            navigation: { name: 'Management', icon: 'User' },
            listProperties: ['name', 'email', 'phone', 'role', 'active', 'verified', 'isSupscriped'],
            editProperties: ['name', 'email', 'phone', 'role', 'active', 'verified', 'isSupscriped'],
            showProperties: ['name', 'email', 'phone', 'role', 'active', 'verified', 'isSupscriped', 'profileImage'],
            properties: {
                password: { isVisible: false },
                passwordChangedAt: { isVisible: false },
                resetCode: { isVisible: false },
                resetCodeExpires: { isVisible: false },
                resetCodeVerified: { isVisible: false },
            },
            actions: {
                new: { isAccessible: false },
            },
        },
    },
    {
        resource: governorateModel_1.default,
        options: {
            navigation: { name: 'Locations', icon: 'Map' },
            listProperties: ['id', 'name'],
            editProperties: ['id', 'name'],
        },
    },
    {
        resource: floorNameModel_1.default,
        options: {
            navigation: { name: 'Locations', icon: 'Map' },
            listProperties: ['id', 'name'],
            editProperties: ['id', 'name'],
        },
    },
    {
        resource: courtTypeModel_1.default,
        options: {
            navigation: { name: 'Locations', icon: 'Map' },
            listProperties: ['id', 'name', 'description'],
            editProperties: ['id', 'name', 'description'],
        },
    },
    {
        resource: officeTypeModel_1.default,
        options: {
            navigation: { name: 'Locations', icon: 'Map' },
            listProperties: ['id', 'name', 'description'],
            editProperties: ['id', 'name', 'description'],
        },
    },
    {
        resource: courtModel_1.default,
        options: {
            navigation: { name: 'Locations', icon: 'Map' },
            listProperties: ['name', 'governorate', 'courtType', 'nFloors', 'nOffices', 'nViews'],
            editProperties: [
                'name',
                'address',
                'governorate',
                'courtType',
                'startingWorkingHours',
                'endWorkingHours',
                'floors',
            ],
            showProperties: [
                'name',
                'address',
                'governorate',
                'courtType',
                'startingWorkingHours',
                'endWorkingHours',
                'floors',
                'nFloors',
                'nOffices',
                'nViews',
                'createdAt',
                'updatedAt',
            ],
        },
    },
];
const createAdminRouter = async () => {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const cookieSecret = process.env.ADMIN_COOKIE_SECRET;
    if (!adminEmail || !adminPassword || !cookieSecret || cookieSecret.length < 32) {
        throw new Error('AdminJS requires ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_COOKIE_SECRET (at least 32 characters)');
    }
    if (mongoose_1.default.connection.readyState !== 1) {
        throw new Error('AdminJS requires an established Mongoose connection before initialization');
    }
    const [adminModule, expressModule, mongooseModule, mongoStoreModule] = await Promise.all([
        import('adminjs'),
        import('@adminjs/express'),
        import('@adminjs/mongoose'),
        import('connect-mongo'),
    ]);
    const AdminJS = adminModule.default;
    const AdminJSExpress = expressModule.default;
    const MongoStore = mongoStoreModule.default;
    AdminJS.registerAdapter({ Database: mongooseModule.Database, Resource: mongooseModule.Resource });
    const admin = new AdminJS({
        rootPath: '/admin',
        resources,
        assets: { scripts: ['/admin-login.js'] },
    });
    return AdminJSExpress.buildAuthenticatedRouter(admin, {
        authenticate: async (email, password) => email === adminEmail && password === adminPassword ? { email: adminEmail } : null,
        cookieName: 'dwar-admin',
        cookiePassword: cookieSecret,
    }, null, {
        secret: cookieSecret,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ client: mongoose_1.default.connection.getClient() }),
        cookie: {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 8 * 60 * 60 * 1000,
        },
    });
};
exports.createAdminRouter = createAdminRouter;
