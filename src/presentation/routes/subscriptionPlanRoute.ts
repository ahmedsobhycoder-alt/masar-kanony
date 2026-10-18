import { Router } from "express";
import { protect, allowedTo, optionalProtect } from "../middlewares/authMiddleware";
import UserRole from "../../shared/constants/user-roles.enum";
import SubscriptionPlanController from "../controllers/subscriptionPlanController";
import SubscriptionPlanUseCases from "../../domain/usecases/subscriptionPlanUseCases";
import subscriptionPlanRepoImpl from "../../infrastructure/database/repositories/subscriptionPlanRepoImpl";
import asyncHandler from "express-async-handler";
import SubscriptionPlanModel from "../../infrastructure/database/models/subscriptionPlanModel";
import { Request, Response, NextFunction } from "express";
import {
    createSubscriptionPlanValidator,
    getSubscriptionPlanByIdValidator,
    updateSubscriptionPlanValidator,
} from "../validators/subscriptionPlanValidator";
import ApiError from "../../shared/errors/apiError";
import { getSubscriptionPlanStatistics } from "../../infrastructure/services/subscriptionPlanAnalytics";

const subscriptionPlanRouter = Router();
const subscriptionPlanController = new SubscriptionPlanController(
    new SubscriptionPlanUseCases({ subscriptionPlanRepo: subscriptionPlanRepoImpl })
);
const onlyOne = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const planCount = await SubscriptionPlanModel.countDocuments();

    if (planCount > 0) {
        return next(
            new ApiError(400, 'خطة الاشتراك موجودة بالفعل. يمكنك تعديل الخطة الحالية فقط.')
        );
    }

    next();
});
subscriptionPlanRouter.get("/stats", protect, allowedTo([UserRole.ADMIN]), asyncHandler(async (req, res) => {
    res.json({ status: true, message: "Success", data: await getSubscriptionPlanStatistics() });
}));
subscriptionPlanRouter.get("/admin", protect, allowedTo([UserRole.ADMIN]), (req, res, next) => {
    (req as any).skipPlanAnalytics = true;
    next();
}, subscriptionPlanController.getSubscriptionPlans);

subscriptionPlanRouter
    .route("/")
    .get(optionalProtect, subscriptionPlanController.getSubscriptionPlans)
    .post(
        protect,
        allowedTo([UserRole.ADMIN]),
        onlyOne,
        createSubscriptionPlanValidator,
        subscriptionPlanController.createSubscriptionPlan
    );

subscriptionPlanRouter
    .route("/:id")
    .get(optionalProtect, getSubscriptionPlanByIdValidator, subscriptionPlanController.getSubscriptionPlanById)
    .put(
        protect,
        allowedTo([UserRole.ADMIN]),
        getSubscriptionPlanByIdValidator,
        updateSubscriptionPlanValidator,
        subscriptionPlanController.updateSubscriptionPlan
    )
    .delete(
        protect,
        allowedTo([UserRole.ADMIN]),
        getSubscriptionPlanByIdValidator,
        subscriptionPlanController.deleteSubscriptionPlanById
    );

export default subscriptionPlanRouter;
