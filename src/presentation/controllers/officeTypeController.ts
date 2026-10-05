import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";

import { OfficeTypeUseCases } from "../../domain/usecases/officeTypeUseCases";
import { formatJson } from "../../shared/utils/formatJson";

export class OfficeTypeController {
  private readonly officeTypeUseCases: OfficeTypeUseCases;

  constructor(officeTypeUseCases: OfficeTypeUseCases) {
    this.officeTypeUseCases = officeTypeUseCases;
  }

  createOfficeType = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const officeTypeData = req.body;
    const createdOfficeType = await this.officeTypeUseCases.createOfficeType(officeTypeData);
    res.status(201).json(
      formatJson({
        data: createdOfficeType,
        message: "Office type created successfully",
        status: true,
      })
    );
  });

  getAllOfficeTypes = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { data, pagination } = await this.officeTypeUseCases.getOfficeTypes(req.query as Record<string, any>);
    res.status(200).json(
      formatJson({
        data: { list: data, paginationResult: pagination },
        message: "Office types fetched successfully",
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
        message: "Office type fetched successfully",
        status: true,
      })
    );
  });
}
