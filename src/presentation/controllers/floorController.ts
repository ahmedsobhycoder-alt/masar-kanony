import { FloorUseCases } from "../../domain/usecases/floorUseCases";
import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";

import { formatJson } from "../../shared/utils/formatJson";
import { printGreen, printBlue } from "../../shared/utils/printColors";
import { stringify } from "node:querystring";
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
        res.status(201).json(formatJson({ data: createdFloor, message: "Floor created successfully", status: true }));
    })
    getAllFloors = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

        const query = {
            ...req.query,
            ...req.filter
        }
        const { data, pagination } = await this.floorUseCases.getFloors(query);
        res.status(200).json(formatJson({ data: { list: data, paginationResult: pagination }, message: "Floors fetched successfully", status: true}));
    })

}