import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import path from 'path';
// Initialize Admin
import AdminJS from 'adminjs';
import * as AdminJSMongoose from '@adminjs/mongoose';
import UserModel from './infrastructure/database/models/userModel';


import AdminJSExpress from '@adminjs/express';
import courtRouter from './presentation/routes/courtRoute';
import floorRouter from './presentation/routes/floorRoute';
import officeRouter from './presentation/routes/officeRoute';
import governorateRouter from './presentation/routes/governorateRoute';
import cityRouter from './presentation/routes/cityRoute';
import floorNameRouter from './presentation/routes/floorNameRoute';
import adsRouter from './presentation/routes/adsRoute';
import homeRouter from './presentation/routes/homeRoute';
import courtTypeRouter from './presentation/routes/courtTypeRoute';
import officeTypeRouter from './presentation/routes/officeTypeRoute';
import authRouter from './presentation/routes/authRoute';
import userRouter from './presentation/routes/userRoute';
import paymentOptionRouter from './presentation/routes/paymentOptionRoute';
import paymentRouter from './presentation/routes/paymentRoute';
import appConfigRouter from './presentation/routes/appConfigRoute';
import appPolicyRouter from './presentation/routes/appPolicyRoute';
import subscriptionPlanRouter from './presentation/routes/subscriptionPlanRoute';
import { globalError } from './presentation/middlewares/errorMiddleware';
import ApiError from './shared/errors/apiError';
import i18nMiddleware from './presentation/middlewares/i18nMiddleware';




// Load environment variables before anything else that depends on them.
dotenv.config();

const server = express();
// 1. Register adapter directly
AdminJS.registerAdapter(AdminJSMongoose);

import { ResourceWithOptions } from 'adminjs';
// 2. Configure AdminJS instance
// const resource :  Array<ResourceWithOptions | any> = [
//  {
//       resource: UserModel,
//     options: {
//         navigation: { name: 'User Management', icon: 'User' },
//         // 1. Only show the columns you actually want to see in the table view
//         listProperties: ['name', 'email', 'phone', 'role', 'createdAt'],

//         // 2. Hide sensitive/internal auth fields from forms and views completely
//         properties: {
//           password: {
//             isVisible: false, // or isVisible: { list: false, filter: false, show: false, edit: true }
//           },
//           resetCode: {
//             isVisible: false,
//           },
//           resetCodeExpires: {
//             isVisible: false,
//           },
//           passwordChangedAt: {
//             isVisible: { list: false, filter: true, show: true, edit: false },
//           },
//           _id: {
//             isVisible: { list: false, filter: true, show: true, edit: false }, // hide Mongo ID from table list
//           },
//         },
//     },}
// ];
import resources from './presentation/admin/adminResources';
export const admin = new AdminJS({
  rootPath: '/admin',
  resources: resources,
});


const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
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
 server.use(admin.options.rootPath, adminRouter);


// let adminRouter: ReturnType<typeof createAdminRouter>;
// server.use('/admin', (req, res, next) => {
//   adminRouter.then((router) => router(req, res, next)).catch(next);
// });

// -----------------------------------------------------------------------------
// Global middleware
// -----------------------------------------------------------------------------
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(i18nMiddleware); // Use the i18n middleware to handle language detection and translation
server.set('query parser', 'extended');
server.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
// -----------------------------------------------------------------------------
// Application routes
// -----------------------------------------------------------------------------
server.use('/api/v1/courts/', courtRouter);
server.use('/api/v1/floors/', floorRouter);
server.use('/api/v1/offices/', officeRouter);
server.use('/api/v1/governorates/', governorateRouter);
server.use('/api/v1/cities/', cityRouter);
server.use('/api/v1/floorNames/', floorNameRouter);
server.use('/api/v1/ads/', adsRouter);
server.use('/api/v1/home', homeRouter);
server.use('/api/v1/courtypes/', courtTypeRouter);
server.use('/api/v1/officeTypes/', officeTypeRouter);
server.use('/api/v1/users/', userRouter);
server.use('/api/v1/auth/', authRouter);
server.use('/api/v1/payment/paymentOption/',paymentOptionRouter);
server.use('/api/v1/payment/',paymentRouter);
server.use('/api/v1/subscriptionPlan/', subscriptionPlanRouter);
server.use('/api/v1/appConfig/',appConfigRouter);
server.use('/api/v1/appPolicies/', appPolicyRouter);



// Nested route for floors under a specific court.
server.use('/api/v1/courts/:courtId/floors', floorRouter);

// -----------------------------------------------------------------------------
// Health check / base route
// -----------------------------------------------------------------------------
server.get('/', (req: any, res: any) => {
  res.send(req.t('hello_world', { ns: 'common' }));
});

// -----------------------------------------------------------------------------
// Not-found handler
// -----------------------------------------------------------------------------
server.all(/.*/, (req, res, next) => {
  next(new ApiError(404, req.t('route_not_found', { ns: 'errors', route: req.originalUrl })));
});

// -----------------------------------------------------------------------------
// Global error middleware
// -----------------------------------------------------------------------------
server.use(globalError);

// export const initializeAdmin = async () => {
//   adminRouter = createAdminRouter();
//   await adminRouter;
// };




// export const start = async () => {



//   // 2. Build authenticated router for AdminJS
 
//   // 3. Mount AdminJS router BEFORE body-parser middlewares that might interfere with file uploads
 

//   // Standard app middlewares can go here
//   server.use(express.json());

//   server.listen(process.env.PORT, () => {
//     console.log(`AdminJS available at http://localhost:${process.env.PORT}${admin.options.rootPath}`);
//   });
// };


export default server;