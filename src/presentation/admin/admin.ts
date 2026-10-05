import CourtModel from '../../infrastructure/database/models/courtModel';
import CourtTypeModel from '../../infrastructure/database/models/courtTypeModel';
import FloorNameModel from '../../infrastructure/database/models/floorNameModel';
import GovernorateModel from '../../infrastructure/database/models/governorateModel';
import OfficeTypeModel from '../../infrastructure/database/models/officeTypeModel';
import UserModel from '../../infrastructure/database/models/userModel';
import mongoose from 'mongoose';

const resources = [
		{
			resource: UserModel,
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
			resource: GovernorateModel,
			options: {
				navigation: { name: 'Locations', icon: 'Map' },
				listProperties: ['id', 'name'],
				editProperties: ['id', 'name'],
			},
		},
		{
			resource: FloorNameModel,
			options: {
				navigation: { name: 'Locations', icon: 'Map' },
				listProperties: ['id', 'name'],
				editProperties: ['id', 'name'],
			},
		},
		{
			resource: CourtTypeModel,
			options: {
				navigation: { name: 'Locations', icon: 'Map' },
				listProperties: ['id', 'name', 'description'],
				editProperties: ['id', 'name', 'description'],
			},
		},
		{
			resource: OfficeTypeModel,
			options: {
				navigation: { name: 'Locations', icon: 'Map' },
				listProperties: ['id', 'name', 'description'],
				editProperties: ['id', 'name', 'description'],
			},
		},
		{
			resource: CourtModel,
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

export const createAdminRouter = async () => {
	const adminEmail = process.env.ADMIN_EMAIL;
	const adminPassword = process.env.ADMIN_PASSWORD;
	const cookieSecret = process.env.ADMIN_COOKIE_SECRET;

	if (!adminEmail || !adminPassword || !cookieSecret || cookieSecret.length < 32) {
		throw new Error(
			'AdminJS requires ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_COOKIE_SECRET (at least 32 characters)',
		);
	}
	if (mongoose.connection.readyState !== 1) {
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

	return AdminJSExpress.buildAuthenticatedRouter(
		admin,
		{
			authenticate: async (email, password) =>
				email === adminEmail && password === adminPassword ? { email: adminEmail } : null,
			cookieName: 'dwar-admin',
			cookiePassword: cookieSecret,
		},
		null,
		{
			secret: cookieSecret,
			resave: false,
			saveUninitialized: false,
			store: MongoStore.create({ client: mongoose.connection.getClient() }),
			cookie: {
				httpOnly: true,
				sameSite: 'lax',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 8 * 60 * 60 * 1000,
			},
		},
	);
};
