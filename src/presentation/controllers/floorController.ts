import { FloorUseCases } from "../../domain/usecases/floorUseCases";
import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";

import { formatJson } from "../../shared/utils/formatJson";
import { printGreen, printBlue } from "../../shared/utils/printColors";
import { stringify } from "node:querystring";
import ApiError from "../../shared/errors/apiError";
import pickAllowedFields from "../../shared/utils/pickAllowedFields";
export class FloorController {
    private readonly floorUseCases: FloorUseCases;
    constructor(floorUseCases: FloorUseCases) {
        this.floorUseCases = floorUseCases;
    }
    createFloor = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const floorName = (req as any).floorName;
              printGreen("req.floorName", (req as any).floorName);
        const floorData = { ...req.body, floorName };

        floorData.floorName = floorName;
        printBlue("floorData", JSON.stringify(floorData));
        const createdFloor = await this.floorUseCases.createFloor(
            floorData
        );
        res.status(201).json(formatJson({ data: createdFloor, message: req.t("Floor created successfully", { ns: "common" }), status: true }));
    })
    getAllFloors = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

        const query = {
            ...req.query,
            ...req.filter
        }
        const { data, pagination } = await this.floorUseCases.getFloors(query);
        res.status(200).json(formatJson({ data: { list: data, paginationResult: pagination }, message: req.t("Floors fetched successfully", { ns: "common" }), status: true}));
    })

    updateFloor = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const updates = pickAllowedFields(req.body, ["floorName"]);
        const floor = await this.floorUseCases.updateFloorById(req.params.id as string, updates as any);
        if (!floor) throw new ApiError(404, "Floor not found");
        res.status(200).json(formatJson({ data: floor, message: req.t("Floor updated successfully", { ns: "common" }), status: true }));
    });

    deleteFloor = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const floor = await this.floorUseCases.deleteFloorById(req.params.id as string);
        if (!floor) throw new ApiError(404, "Floor not found");
        res.status(200).json(formatJson({ data: floor, message: req.t("Floor deleted successfully", { ns: "common" }), status: true }));
    });

}