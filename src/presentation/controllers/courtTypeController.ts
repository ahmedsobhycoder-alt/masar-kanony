import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";

import { CourtTypeUseCases } from "../../domain/usecases/courtTypeUseCases";
import { formatJson } from "../../shared/utils/formatJson";

export class CourtTypeController {
  private readonly courtTypeUseCases: CourtTypeUseCases;

  constructor(courtTypeUseCases: CourtTypeUseCases) {
    this.courtTypeUseCases = courtTypeUseCases;
  }

  createCourtType = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const courtTypeData = req.body;
    const createdCourtType = await this.courtTypeUseCases.createCourtType(courtTypeData);
    res.status(201).json(
      formatJson({
        data: createdCourtType,
        message: req.t("Court type created successfully", { ns: "common" }),
        status: true,
      })
    );
  });

  getAllCourtTypes = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { data, pagination } = await this.courtTypeUseCases.getCourtTypes(req.query as Record<string, any>);
    res.status(200).json(
      formatJson({
        data: { list: data, paginationResult: pagination },
        message: req.t("Court types fetched successfully", { ns: "common" }),
        status: true,
      })
    );
  });

  getCourtTypeById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const courtTypeId = req.params.id as string;
    const courtType = await this.courtTypeUseCases.getCourtTypeById(courtTypeId);
    res.status(200).json(
      formatJson({
        data: courtType,
        message: req.t("Court type fetched successfully", { ns: "common" }),
        status: true,
      })
    );
  });
}
