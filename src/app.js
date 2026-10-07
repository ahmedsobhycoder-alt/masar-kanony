"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeAdmin = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const courtRoute_1 = __importDefault(require("./presentation/routes/courtRoute"));
const floorRoute_1 = __importDefault(require("./presentation/routes/floorRoute"));
const officeRoute_1 = __importDefault(require("./presentation/routes/officeRoute"));
const governorateRoute_1 = __importDefault(require("./presentation/routes/governorateRoute"));
const cityRoute_1 = __importDefault(require("./presentation/routes/cityRoute"));
const floorNameRoute_1 = __importDefault(require("./presentation/routes/floorNameRoute"));
const adsRoute_1 = __importDefault(require("./presentation/routes/adsRoute"));
const homeRoute_1 = __importDefault(require("./presentation/routes/homeRoute"));
const courtTypeRoute_1 = __importDefault(require("./presentation/routes/courtTypeRoute"));
const officeTypeRoute_1 = __importDefault(require("./presentation/routes/officeTypeRoute"));
const authRoute_1 = __importDefault(require("./presentation/routes/authRoute"));
const userRoute_1 = __importDefault(require("./presentation/routes/userRoute"));
const paymentOptionRoute_1 = __importDefault(require("./presentation/routes/paymentOptionRoute"));
const paymentRoute_1 = __importDefault(require("./presentation/routes/paymentRoute"));
const appConfigRoute_1 = __importDefault(require("./presentation/routes/appConfigRoute"));
const appPolicyRoute_1 = __importDefault(require("./presentation/routes/appPolicyRoute"));
const admin_1 = require("./presentation/admin/admin");
const errorMiddleware_1 = require("./presentation/middlewares/errorMiddleware");
const apiError_1 = __importDefault(require("./shared/errors/apiError"));
const i18nMiddleware_1 = __importDefault(require("./presentation/middlewares/i18nMiddleware"));
// Load environment variables before anything else that depends on them.
dotenv_1.default.config();
const server = (0, express_1.default)();
server.get('/admin-login.js', (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/admin-login.js'));
});
let adminRouter;
server.use('/admin', (req, res, next) => {
    adminRouter.then((router) => router(req, res, next)).catch(next);
});
// -----------------------------------------------------------------------------
// Global middleware
// -----------------------------------------------------------------------------
server.use(body_parser_1.default.json());
server.use(body_parser_1.default.urlencoded({ extended: true }));
server.use(i18nMiddleware_1.default); // Use the i18n middleware to handle language detection and translation
server.set('query parser', 'extended');
server.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../public/uploads')));
// -----------------------------------------------------------------------------
// Application routes
// -----------------------------------------------------------------------------
server.use('/api/v1/courts/', courtRoute_1.default);
server.use('/api/v1/floors/', floorRoute_1.default);
server.use('/api/v1/offices/', officeRoute_1.default);
server.use('/api/v1/governorates/', governorateRoute_1.default);
server.use('/api/v1/cities/', cityRoute_1.default);
server.use('/api/v1/floorNames/', floorNameRoute_1.default);
server.use('/api/v1/ads/', adsRoute_1.default);
server.use('/api/v1/home', homeRoute_1.default);
server.use('/api/v1/courtypes/', courtTypeRoute_1.default);
server.use('/api/v1/officeTypes/', officeTypeRoute_1.default);
server.use('/api/v1/users/', userRoute_1.default);
server.use('/api/v1/auth/', authRoute_1.default);
server.use('/api/v1/payment/paymentOption/', paymentOptionRoute_1.default);
server.use('/api/v1/payment/', paymentRoute_1.default);
server.use('/api/v1/appConfig/', appConfigRoute_1.default);
server.use('/api/v1/appPolicies/', appPolicyRoute_1.default);
// Nested route for floors under a specific court.
server.use('/api/v1/courts/:courtId/floors', floorRoute_1.default);
// -----------------------------------------------------------------------------
// Health check / base route
// -----------------------------------------------------------------------------
server.get('/', (req, res) => {
    res.send(req.t('hello_world', { ns: 'common' }));
});
// -----------------------------------------------------------------------------
// Not-found handler
// -----------------------------------------------------------------------------
server.all(/.*/, (req, res, next) => {
    next(new apiError_1.default(404, req.t('route_not_found', { ns: 'errors', route: req.originalUrl })));
});
// -----------------------------------------------------------------------------
// Global error middleware
// -----------------------------------------------------------------------------
server.use(errorMiddleware_1.globalError);
const initializeAdmin = async () => {
    adminRouter = (0, admin_1.createAdminRouter)();
    await adminRouter;
};
exports.initializeAdmin = initializeAdmin;
exports.default = server;
