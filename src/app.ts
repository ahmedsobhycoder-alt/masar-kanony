import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import path from 'path';
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
import adminManagementRouter from './presentation/routes/adminManagementRoute';
import subscriptionPlanRouter from './presentation/routes/subscriptionPlanRoute';
import { globalError } from './presentation/middlewares/errorMiddleware';
import ApiError from './shared/errors/apiError';
import i18nMiddleware from './presentation/middlewares/i18nMiddleware';
import rejectionRouter from './presentation/routes/rejectionRouter';

import notificationRouter from "./presentation/routes/notificationRoute";

// Load environment variables before anything else that depends on them.
dotenv.config();

const server = express();
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(i18nMiddleware); // Use the i18n middleware to handle language detection and translation
server.set('query parser', 'extended');
server.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
// -----------------------------------------------------------------------------
// Application routes
// -----------------------------------------------------------------------------
// Adjust this path if admin-panel is inside ~/htdocs/admin-panel or nested
const adminBuildPath = path.resolve(__dirname, '../../admin-panel/build');
// If admin-panel is inside the masar project folder, use:
// const adminBuildPath = path.resolve(__dirname, '../admin-panel/build');

// 1. Serve static JS, CSS, images under /admin
server.use('/admin', express.static(adminBuildPath));

// 2. Client-side routing fallback (SPA support)
server.get('/admin*', (req, res) => {
  res.sendFile(path.join(adminBuildPath, 'index.html'));
});
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
server.use('/api/v1/admin-management/', adminManagementRouter);
server.use('/api/v1/auth/', authRouter);
server.use('/api/v1/payment/paymentOption/',paymentOptionRouter);
server.use('/api/v1/payment/',paymentRouter);
server.use('/api/v1/subscriptionPlan/', subscriptionPlanRouter);
server.use('/api/v1/appConfig/',appConfigRouter);
server.use('/api/v1/appPolicies/', appPolicyRouter);
server.use('/api/v1/rejection/', rejectionRouter);

server.use("/api/v1/notifications", notificationRouter);

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

export default server;
