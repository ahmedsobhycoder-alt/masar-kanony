import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import SubscriptionPlanUseCases from "../../domain/usecases/subscriptionPlanUseCases";
import { formatJson } from "../../shared/utils/formatJson";

class SubscriptionPlanController {
    readonly subscriptionPlanUseCases: SubscriptionPlanUseCases;

    constructor(subscriptionPlanUseCases: SubscriptionPlanUseCases) {
        this.subscriptionPlanUseCases = subscriptionPlanUseCases;
    }

    getSubscriptionPlans = asyncHandler(async (req: Request, res: Response) => {
        const supscriptionPlan = await this.subscriptionPlanUseCases.getSubscriptionPlans(req.query as Record<string, any>);

        res.status(200).json(formatJson({
            data: supscriptionPlan,
            message: req.t("Subscription plans fetched successfully", { ns: "common" }),
            status: true,
        }));
    });

    getSubscriptionPlanById = asyncHandler(async (req: Request, res: Response) => {
        const id = String(req.params.id);
        const subscriptionPlan = await this.subscriptionPlanUseCases.getSubscriptionPlanById(id);

        if (!subscriptionPlan) {
            res.status(404).json(formatJson({
                data: null,
                message: req.t("Subscription plan not found", { ns: "common" }),
                status: false,
            }));
            return;
        }

        res.status(200).json(formatJson({
            data: subscriptionPlan,
            message: req.t("Subscription plan fetched successfully", { ns: "common" }),
            status: true,
        }));
    });

    createSubscriptionPlan = asyncHandler(async (req: Request, res: Response) => {
        const createdSubscriptionPlan = await this.subscriptionPlanUseCases.createSubscriptionPlan(req.body);

        res.status(201).json(formatJson({
            data: createdSubscriptionPlan,
            message: req.t("Subscription plan created successfully", { ns: "common" }),
            status: true,
        }));
    });

    updateSubscriptionPlan = asyncHandler(async (req: Request, res: Response) => {
        const id = String(req.params.id);
        const updatedSubscriptionPlan = await this.subscriptionPlanUseCases.updateSubscriptionPlan(id, req.body);

        if (!updatedSubscriptionPlan) {
            res.status(404).json(formatJson({
                data: null,
                message: req.t("Subscription plan not found", { ns: "common" }),
                status: false,
            }));
            return;
        }

        res.status(200).json(formatJson({
            data: updatedSubscriptionPlan,
            message: req.t("Subscription plan updated successfully", { ns: "common" }),
            status: true,
        }));
    });

    deleteSubscriptionPlanById = asyncHandler(async (req: Request, res: Response) => {
        const id = String(req.params.id);
        const deletedSubscriptionPlan = await this.subscriptionPlanUseCases.deleteSubscriptionPlanById(id);

        if (!deletedSubscriptionPlan) {
            res.status(404).json(formatJson({
                data: null,
                message: req.t("Subscription plan not found", { ns: "common" }),
                status: false,
            }));
            return;
        }

        res.status(200).json(formatJson({
            data: deletedSubscriptionPlan,
            message: req.t("Subscription plan deleted successfully", { ns: "common" }),
            status: true,
        }));
    });
}

export default SubscriptionPlanController;
