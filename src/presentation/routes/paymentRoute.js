"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentModel_1 = __importDefault(require("../../infrastructure/database/models/paymentModel"));
const paymentValidator_1 = require("../validators/paymentValidator");
const paymentController_1 = __importDefault(require("../controllers/paymentController"));
const paymentUseCases_1 = __importDefault(require("../../domain/usecases/paymentUseCases"));
const paymentRepoImpl_1 = __importDefault(require("../../infrastructure/database/repositories/paymentRepoImpl"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const imageProcessingMiddleware_1 = require("../middlewares/imageProcessingMiddleware");
const apiError_1 = __importDefault(require("../../shared/errors/apiError"));
const payment_status_enums_1 = __importDefault(require("../../shared/constants/payment-status.enums"));
const user_roles_enum_1 = __importDefault(require("../../shared/constants/user-roles.enum"));
const paymentRouter = (0, express_1.Router)();
const paymentController = new paymentController_1.default(new paymentUseCases_1.default({ paymentRepo: paymentRepoImpl_1.default }));
paymentRouter
    .route("/")
    .post(authMiddleware_1.protect, (0, authMiddleware_1.allowedTo)([user_roles_enum_1.default.USER]), isSubscripedBefore, (0, imageProcessingMiddleware_1.uploadSingleImageAndDoIMageProcessing)("transactionId", "public/uploads/payments"), paymentValidator_1.createPaymentValidator, paymentController.createPayment)
    .get(authMiddleware_1.protect, (0, authMiddleware_1.allowedTo)([user_roles_enum_1.default.ADMIN]), paymentValidator_1.getPaymentsValidator, paymentController.getPayments);
paymentRouter
    .route("/:id")
    .get(authMiddleware_1.protect, (0, authMiddleware_1.allowedTo)([user_roles_enum_1.default.ADMIN]), paymentValidator_1.getPaymentByIdValidator, paymentController.getPaymentById)
    .delete(authMiddleware_1.protect, (0, authMiddleware_1.allowedTo)([user_roles_enum_1.default.ADMIN]), paymentValidator_1.getPaymentByIdValidator, paymentController.deletePaymentById);
paymentRouter.put("/:id/status", authMiddleware_1.protect, (0, authMiddleware_1.allowedTo)([user_roles_enum_1.default.ADMIN]), paymentValidator_1.updatePaymentStatusValidator, paymentController.updatePaymentStatus);
paymentRouter.post("/approve/:id", authMiddleware_1.protect, (0, authMiddleware_1.allowedTo)([user_roles_enum_1.default.ADMIN]), paymentController.approvePayment);
paymentRouter.post("/decline/:id", authMiddleware_1.protect, (0, authMiddleware_1.allowedTo)([user_roles_enum_1.default.ADMIN]), paymentController.declinePayment);
// isSubscripedBefore is a middleware function that checks if the user has an active subscription before allowing them to create a payment. If the user does not have an active subscription, it will return a 403 Forbidden response.
async function isSubscripedBefore(req, res, next) {
    const user = req.user; // Assuming req.user is populated by authentication middleware
    const payment = await paymentModel_1.default.findOne({ user: user.id });
    if (payment && payment.status === payment_status_enums_1.default.PENDING) {
        throw new apiError_1.default(403, req.t("You already have a pending payment. Please wait admin to approve it ", { ns: "errors" }));
    }
    next();
}
exports.default = paymentRouter;
