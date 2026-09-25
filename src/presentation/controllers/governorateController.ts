import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";

import { GovernorateUseCases } from "../../domain/usecases/governorateUseCases";
import { formatJson } from "../../shared/utils/formatJson";
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
                    message: "Governorate created successfully",
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
                    message: "Governorates fetched successfully",
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
                    message: "Governorate fetched successfully",
                    status: true,
                }),
            );
        },
    );
}
