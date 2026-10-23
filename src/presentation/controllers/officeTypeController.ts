import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";

import { OfficeTypeUseCases } from "../../domain/usecases/officeTypeUseCases";
import { formatJson } from "../../shared/utils/formatJson";

import ApiError from "../../shared/errors/apiError";
import pickAllowedFields from "../../shared/utils/pickAllowedFields";

export class OfficeTypeController {
  private readonly officeTypeUseCases: OfficeTypeUseCases;

  constructor(officeTypeUseCases: OfficeTypeUseCases) {
    this.officeTypeUseCases = officeTypeUseCases;
  }

  createOfficeType = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const officeTypeData = pickAllowedFields(req.body, ["name", "description"]) as any;
    const createdOfficeType = await this.officeTypeUseCases.createOfficeType(officeTypeData);
    res.status(201).json(
      formatJson({
        data: createdOfficeType,
        message: req.t("Office type created successfully", { ns: "common" }),
        status: true,
      })
    );
  });

  updateOfficeType = asyncHandler(async (req: Request, res: Response) => {
    const data = pickAllowedFields(req.body, ["name", "description"]);
    const type = await this.officeTypeUseCases.updateOfficeTypeById(req.params.id as string, data);
    if (!type) throw new ApiError(404, "Office type not found");
    res.json(formatJson({ data: type, message: "Changes saved", status: true }));
  });

  deleteOfficeType = asyncHandler(async (req: Request, res: Response) => {
    const type = await this.officeTypeUseCases.deleteOfficeTypeById(req.params.id as string);
    if (!type) throw new ApiError(404, "Office type not found");
    res.json(formatJson({ data: type, message: "Item deleted", status: true }));
  });

  getAllOfficeTypes = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { data, pagination } = await this.officeTypeUseCases.getOfficeTypes(req.query as Record<string, any>);
    res.status(200).json(
      formatJson({
        data: { list: data, paginationResult: pagination },
        message: req.t("Office types fetched successfully", { ns: "common" }),
        status: true,
      })
    );
  });

  getOfficeTypeById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const officeTypeId = req.params.id as string;
    const officeType = await this.officeTypeUseCases.getOfficeTypeById(officeTypeId);
    res.status(200).json(
      formatJson({
        data: officeType,
        message: req.t("Office type fetched successfully", { ns: "common" }),
        status: true,
      })
    );
  });
}
