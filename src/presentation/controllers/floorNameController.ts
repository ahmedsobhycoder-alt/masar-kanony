import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";

import { FloorNameUseCases } from "../../domain/usecases/floorNameUseCases";
import { formatJson } from "../../shared/utils/formatJson";

export class FloorNameController {
  private readonly floorNameUseCases: FloorNameUseCases;

  constructor(floorNameUseCases: FloorNameUseCases) {
    this.floorNameUseCases = floorNameUseCases;
  }

  createFloorName = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const floorNameData = req.body;
    const createdFloorName = await this.floorNameUseCases.createFloorName(floorNameData);
    res.status(201).json(
      formatJson({
        data: createdFloorName,
        message: req.t("Floor name created successfully", { ns: "common" }),
        status: true,
      })
    );
  });

  getAllFloorNames = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { data, pagination } = await this.floorNameUseCases.getFloorNames(req.query as Record<string, any>);
    res.status(200).json(
      formatJson({
        data: { list: data, paginationResult: pagination },
        message: req.t("Floor names fetched successfully", { ns: "common" }),
        status: true,
      })
    );
  });

  getFloorNameById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const floorNameId = req.params.id as string;
    const floorName = await this.floorNameUseCases.getFloorNameById(floorNameId);
    res.status(200).json(
      formatJson({
        data: floorName,
        message: req.t("Floor name fetched successfully", { ns: "common" }),
        status: true,
      })
    );
  });
}
