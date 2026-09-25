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
        message: "Court type created successfully",
        status: true,
      })
    );
  });

  getAllCourtTypes = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { data, pagination } = await this.courtTypeUseCases.getCourtTypes(req.query as Record<string, any>);
    res.status(200).json(
      formatJson({
        data: { list: data, paginationResult: pagination },
        message: "Court types fetched successfully",
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
        message: "Court type fetched successfully",
        status: true,
      })
    );
  });
}
