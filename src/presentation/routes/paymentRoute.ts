import { Router } from "express";
import PaymnetModel from "../../infrastructure/database/models/paymentModel";
import {
    createPaymentValidator,
    updatePaymentStatusValidator,
    getPaymentByIdValidator,
    getPaymentsValidator,
} from "../validators/paymentValidator";
import PaymentController from "../controllers/paymentController";
import PaymentUseCases from "../../domain/usecases/paymentUseCases";
import paymentRepoImpl from "../../infrastructure/database/repositories/paymentRepoImpl";
import { Request, Response, NextFunction } from "express";
import { protect, allowedTo } from "../middlewares/authMiddleware";
import { uploadSingleImageAndDoIMageProcessing } from "../middlewares/imageProcessingMiddleware";
import ApiError from "../../shared/errors/apiError";
import { printRed } from "../../shared/utils/printColors";
import PaymentStatus from "../../shared/constants/payment-status.enums";
import UserRole from "../../shared/constants/user-roles.enum";
import UserEntity from "../../domain/entities/userEntity";
const paymentRouter = Router({ mergeParams: true });
const paymentController = new PaymentController(
    new PaymentUseCases({ paymentRepo: paymentRepoImpl })
);

paymentRouter
    .route("/")
    .post(protect, allowedTo([UserRole.USER]), isSubscripedOrHasPendingBefore, uploadSingleImageAndDoIMageProcessing("receiptImageUrl", "public/uploads/payments"), createPaymentValidator, paymentController.createPayment)
    .get(protect, allowedTo([UserRole.ADMIN]), getPaymentsValidator
        , paymentController.getPayments);
paymentRouter.get(
    "/status",
    protect,
    paymentController.getPaymentStatus
);
paymentRouter
    .route("/:id")
    .get(protect, allowedTo([UserRole.ADMIN]), getPaymentByIdValidator, paymentController.getPaymentById)
    .delete(protect, allowedTo([UserRole.ADMIN]), getPaymentByIdValidator, paymentController.deletePaymentById);

paymentRouter.put(
    "/:id/status",
    protect,
    allowedTo([UserRole.ADMIN]),
    updatePaymentStatusValidator,
    paymentController.updatePaymentStatus
);

paymentRouter.post(
    "/approve/:id",
    protect,
    allowedTo([UserRole.ADMIN]),
    paymentController.approvePayment
);

paymentRouter.post(
    "/decline/:id",
    protect,
    allowedTo([UserRole.ADMIN]),
    paymentController.declinePayment
);
// isSubscripedBefore is a middleware function that checks if the user has an active subscription before allowing them to create a payment. If the user does not have an active subscription, it will return a 403 Forbidden response.

async function isSubscripedOrHasPendingBefore(req: Request, res: Response, next: NextFunction) {
    const user = (req as any).user as UserEntity; // Assuming req.user is populated by authentication middleware
    if (user.isSubscribed) {
        throw new ApiError(403, req.t("You already have an active subscription. ", { ns: "errors" }));
    } else {
        const payment = await PaymnetModel.findOne({ user: user.id, paymentStatus: PaymentStatus.PENDING });
        if (payment) {
            throw new ApiError(403, req.t("You already have a pending payment. Please wait admin to approve it ", { ns: "errors" }));
        }
    }
    next();

}
export default paymentRouter;