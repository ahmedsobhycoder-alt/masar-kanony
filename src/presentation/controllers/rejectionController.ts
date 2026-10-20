import RejectionUseCases from "../../domain/usecases/rejectionUseCases";
import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { formatJson } from "../../shared/utils/formatJson";
import ApiError from "../../shared/errors/apiError";
import pickAllowedFields from "../../shared/utils/pickAllowedFields";

export class RejectionController {
    private readonly rejectionUseCases: RejectionUseCases;

    constructor(rejectionUseCases: RejectionUseCases) {
        this.rejectionUseCases = rejectionUseCases;
    }

    createRejection = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const rejectionData = req.body;
            const createdRejection =
                await this.rejectionUseCases.createRejection(rejectionData);

            res.status(201).json(
                formatJson({
                    data: createdRejection,
                    message: req.t("Rejection created successfully", { ns: "common" }),
                    status: true,
                }),
            );
        },
    );

    getAllRejections = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { data, pagination } =
                (await this.rejectionUseCases.getRejections(req.query)) as any;

            res.status(200).json(
                formatJson({
                    data: {
                        list: data,
                        paginationResult: pagination,
                    },
                    message: req.t("Rejections fetched successfully", { ns: "common" }),
                    status: true,
                }),
            );
        },
    );

    getRejectionById = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const rejectionId = req.params.id as string;
            const rejection =
                await this.rejectionUseCases.getRejectionById(rejectionId);

            if (!rejection) throw new ApiError(404, "Rejection not found");

            res.status(200).json(
                formatJson({
                    data: rejection,
                    message: req.t("Rejection fetched successfully", { ns: "common" }),
                    status: true,
                }),
            );
        },
    );

    updateRejection = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const updates = pickAllowedFields(req.body, [
                "rejectionReason",
                "rejectionMessage",
            ]);
            const rejection = await this.rejectionUseCases.updateRejectionById(
                req.params.id as string,
                updates as any,
            );

            if (!rejection) throw new ApiError(404, "Rejection not found");

            res.status(200).json(
                formatJson({
                    data: rejection,
                    message: req.t("Rejection updated successfully", { ns: "common" }),
                    status: true,
                }),
            );
        },
    );

    deleteRejection = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const rejection = await this.rejectionUseCases.deleteRejectionById(
                req.params.id as string,
            );

            if (!rejection) throw new ApiError(404, "Rejection not found");

            res.status(200).json(
                formatJson({
                    data: rejection,
                    message: req.t("Rejection deleted successfully", { ns: "common" }),
                    status: true,
                }),
            );
        },
    );
}

export default RejectionController;