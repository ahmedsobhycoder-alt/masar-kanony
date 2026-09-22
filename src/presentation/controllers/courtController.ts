import { CourtUseCases } from "../../domain/usecases/courtUseCases";
import { Request, Response, NextFunction } from "express";
import { formatJson } from "../../shared/utils/formatJson";
import asyncHandler from "express-async-handler"

export class CourtController {
    private readonly courtUseCases: CourtUseCases;

    constructor(courtUseCases: CourtUseCases) {
        this.courtUseCases = courtUseCases;
    }

    createCourt = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const courtData = req.body;
        const createdCourt = await this.courtUseCases.createCourt(courtData);
        res.status(201).json(formatJson({ data: createdCourt, message: "Court created successfully", status: "success" })); 
    });
    getAllCourts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { data, pagination } = await this.courtUseCases.getAllCourts(req.query as Record<string, any>);
        res.status(200).json(formatJson({ data: { list: data, paginationResult: pagination }, message: "Courts fetched successfully", status: "success" }));
    })
    getCourtById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const
         courtId = req.params.id as string;
        const court = await this.courtUseCases.getCourtById(courtId);
        res.status(200).json(formatJson({ data: court, message: "Court fetched successfully", status: "success" }));
    })
}
