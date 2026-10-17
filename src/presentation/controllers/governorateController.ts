import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";

import { GovernorateUseCases } from "../../domain/usecases/governorateUseCases";
import { formatJson } from "../../shared/utils/formatJson";
import ApiError from "../../shared/errors/apiError";
import pickAllowedFields from "../../shared/utils/pickAllowedFields";
export class GovernorateController {
    private readonly governorateUseCases: GovernorateUseCases;

    constructor(governorateUseCases: GovernorateUseCases) {
        this.governorateUseCases = governorateUseCases;
    }

    createGovernorate = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const governorateData = req.body;
            const createdGovernorate =
                await this.governorateUseCases.createGovernorate(governorateData);

            res.status(201).json(
                formatJson({
                    data: createdGovernorate,
                    message: req.t("Governorate created successfully", { ns: "common" }),
                    status:true,
                }),
            );
        },
    );

    getAllGovernorates = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { data, pagination } =
                await this.governorateUseCases.getGovernorates(req.query);

            res.status(200).json(
                formatJson({
                    data: {
                        list: data,
                        paginationResult: pagination,
                    },
                    message: req.t("Governorates fetched successfully", { ns: "common" }),
                    status: true,
                }),
            );
        },
    );

    getGovernorateById = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const governorateId = req.params.id as string;
            const governorate =
                await this.governorateUseCases.getGovernorateById(governorateId);
            res.status(200).json(
                formatJson({
                    data: governorate,
                    message: req.t("Governorate fetched successfully", { ns: "common" }),
                    status: true,
                }),
            );
        },
    );

    updateGovernorate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const updates = pickAllowedFields(req.body, ["name"]);
        const governorate = await this.governorateUseCases.updateGovernorateById(req.params.id as string, updates as any);
        if (!governorate) throw new ApiError(404, "Governorate not found");
        res.status(200).json(formatJson({ data: governorate, message: req.t("Governorate updated successfully", { ns: "common" }), status: true }));
    });

    deleteGovernorate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const governorate = await this.governorateUseCases.deleteGovernorateById(req.params.id as string);
        if (!governorate) throw new ApiError(404, "Governorate not found");
        res.status(200).json(formatJson({ data: governorate, message: req.t("Governorate deleted successfully", { ns: "common" }), status: true }));
    });
}
