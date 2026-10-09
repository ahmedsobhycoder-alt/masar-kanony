// Initialize Admin
import AdminJS from 'adminjs';
import * as AdminJSMongoose from '@adminjs/mongoose';
import AdminJSExpress from '@adminjs/express';
import resources from './adminResources';

// 1. Register adapter directly
AdminJS.registerAdapter(AdminJSMongoose);


// 2. Configure AdminJS instance

export const admin = new AdminJS({
	rootPath: '/admin',
	resources: resources,
	env: {
    NODE_ENV: process.env.NODE_ENV || 'development',
  },
});
export const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
	admin,
	{
		authenticate: async (email, password) => {
			// Replace with real hashed credentials or database lookup
			if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
				return { email, role: 'admin' };
			}
			return null;
		},
		cookieName: 'adminjs',
		cookiePassword: 'super-secret-cookie-password-must-be-long',
	},
	null,
	{
		// 1. Keep sessions alive across server restarts (Uncomment if using connect-mongo)
		// store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),

		resave: false,
		saveUninitialized: false, // Prevents creating empty sessions before login
		secret: 'super-secret-session-key',
		cookie: {
			httpOnly: true,
			// CRITICAL: false for localhost/HTTP, true only for HTTPS production
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days in milliseconds
		},
	}
);
