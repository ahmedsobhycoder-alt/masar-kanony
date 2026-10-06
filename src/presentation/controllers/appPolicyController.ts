import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";

import AppPolicyUseCases from "../../domain/usecases/appPolicyUseCases";
import { formatJson } from "../../shared/utils/formatJson";
class AppPolicyController {
    readonly appPolicyUseCases: AppPolicyUseCases;
    constructor(appPolicyUseCases: AppPolicyUseCases) {
        this.appPolicyUseCases = appPolicyUseCases;
    }
    createAppPolicy = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const appPolicyData = req.body;
        appPolicyData.type = req.params.type; // Set the type based on the route parameter
        const createdAppPolicy = await this.appPolicyUseCases.createAppPolicy(appPolicyData);
        res.status(201).json(formatJson({ data: createdAppPolicy, message: req.t("App policy created successfully", { ns: "common" }), status: true }));
    });
    getAppPolicy = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const type = req.params.type || null; // Get the type from the route parameter
        if (type) {
            const appPolicy = await this.appPolicyUseCases.getAppPolicy(type as string);
            if (!appPolicy) {
                res.status(404).json(formatJson({ data: null, message: req.t("App policy not found", { ns: "common" }), status: false }));
                return;
            } else {
                res.status(200).json(formatJson({ data: appPolicy, message: req.t("App policy fetched successfully", { ns: "common" }), status: true }));
                return;
            }

        } else {
            const appPolicy = await this.appPolicyUseCases.getAppPolicy();
            res.status(200).json(formatJson({ data: appPolicy, message: req.t("App policy fetched successfully", { ns: "common" }), status: true }));
        }

    })
    updateAppPolicy = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
            const appPolicyData = req.body??{};
            const type = req.params.type;
            appPolicyData.type = type; // Ensure the type is set in the appPolicyData
            const updatedAppPolicy = await this.appPolicyUseCases.updateAppPolicy(appPolicyData);
            res.status(200).json(formatJson({ data: updatedAppPolicy, message: req.t("App policy updated successfully", { ns: "common" }), status: true }));

        
    })
}
export default AppPolicyController;