import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";

import { CourtTypeUseCases } from "../../domain/usecases/courtTypeUseCases";
import { formatJson } from "../../shared/utils/formatJson";
import ApiError from "../../shared/errors/apiError";
import pickAllowedFields from "../../shared/utils/pickAllowedFields";

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

  updateCourtType = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const updates = pickAllowedFields(req.body, ["name", "description"]);
    const courtType = await this.courtTypeUseCases.updateCourtTypeById(req.params.id as string, updates as any);
    if (!courtType) throw new ApiError(404, "Court type not found");
    res.status(200).json(formatJson({ data: courtType, message: req.t("Court type updated successfully", { ns: "common" }), status: true }));
  });

  deleteCourtType = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const courtType = await this.courtTypeUseCases.deleteCourtTypeById(req.params.id as string);
    if (!courtType) throw new ApiError(404, "Court type not found");
    res.status(200).json(formatJson({ data: courtType, message: req.t("Court type deleted successfully", { ns: "common" }), status: true }));
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
