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
import subscriptionPlanRouter from './presentation/routes/subscriptionPlanRoute';
import { createAdminRouter } from './presentation/admin/admin';
import { globalError } from './presentation/middlewares/errorMiddleware';
import ApiError from './shared/errors/apiError';
import i18nMiddleware from './presentation/middlewares/i18nMiddleware';

// Load environment variables before anything else that depends on them.
dotenv.config();

const server = express();

server.get('/admin-login.js', (_req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin-login.js'));
});

let adminRouter: ReturnType<typeof createAdminRouter>;
server.use('/admin', (req, res, next) => {
  adminRouter.then((router) => router(req, res, next)).catch(next);
});

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

export const initializeAdmin = async () => {
  adminRouter = createAdminRouter();
  await adminRouter;
};

export default server;