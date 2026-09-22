import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import path from 'path';

import courtRouter from './presentation/routes/courtRoute';
import floorRouter from './presentation/routes/floorRoute';
import officeRouter from './presentation/routes/officeRoute';
import governorateRouter from './presentation/routes/governorateRoute';
import floorNameRouter from './presentation/routes/floorNameRoute';
import adsRouter from './presentation/routes/adsRoute';
import homeRouter from './presentation/routes/homeRoute';
import courtTypeRouter from './presentation/routes/courtTypeRoute';
import officeTypeRouter from './presentation/routes/officeTypeRoute';
import authRouter from './presentation/routes/authRoute';
import userRouter from './presentation/routes/userRoute';
import { globalError } from './presentation/middlewares/errorMiddleware';
import ApiError from './shared/errors/apiError';

// Load environment variables before anything else that depends on them.
dotenv.config();

const server = express();

// -----------------------------------------------------------------------------
// Global middleware
// -----------------------------------------------------------------------------
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.set('query parser', 'extended');
server.use(express.static(path.join(__dirname, '../public/uploads')));

// -----------------------------------------------------------------------------
// Application routes
// -----------------------------------------------------------------------------
server.use('/api/v1/courts/', courtRouter);
server.use('/api/v1/floors/', floorRouter);
server.use('/api/v1/offices/', officeRouter);
server.use('/api/v1/governorates/', governorateRouter);
server.use('/api/v1/floorNames/', floorNameRouter);
server.use('/api/v1/ads/', adsRouter);
server.use('/api/v1/home', homeRouter);
server.use('/api/v1/courtypes/', courtTypeRouter);
server.use('/api/v1/officeTypes/', officeTypeRouter);
server.use('/api/v1/users/', userRouter);
server.use('/api/v1/auth/', authRouter);

// Nested route for floors under a specific court.
server.use('/api/v1/courts/:courtId/floors', floorRouter);

// -----------------------------------------------------------------------------
// Health check / base route
// -----------------------------------------------------------------------------
server.get('/', (req: any, res: any) => {
  res.send('Hello, World!');
});

// -----------------------------------------------------------------------------
// Not-found handler
// -----------------------------------------------------------------------------
server.all(/.*/, (req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// -----------------------------------------------------------------------------
// Global error middleware
// -----------------------------------------------------------------------------
server.use(globalError);

export default server;