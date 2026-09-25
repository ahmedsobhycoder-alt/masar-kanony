import OfficeUseCases from "../../domain/usecases/officeUseCases";
import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";

import { formatJson } from "../../shared/utils/formatJson"; 

export default class OfficesController {
    private readonly officeUseCases: OfficeUseCases
    constructor({ officeUseCases }: { officeUseCases: OfficeUseCases }) {
        this.officeUseCases = officeUseCases;
    }

    createOffice = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const officeData = req.body;
        const createdOffice = await this.officeUseCases.createOffice(officeData);
        res.status(201).json(formatJson({ data: createdOffice, message: "Office created successfully", status: true }));
    })

    getOffices = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { data, pagination } = await this.officeUseCases.getOffices(req.query as Record<string, any>);
        res.status(200).json(formatJson({ data: { list: data, paginationResult: pagination }, message: "Offices fetched successfully", status: true }));
    })
}