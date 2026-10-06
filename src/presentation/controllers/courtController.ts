import { CourtUseCases } from "../../domain/usecases/courtUseCases";
import { Request, Response, NextFunction } from "express";
import { formatJson } from "../../shared/utils/formatJson";
import asyncHandler from "express-async-handler"
import { printRed } from "../../shared/utils/printColors";

export class CourtController {
    private readonly courtUseCases: CourtUseCases;

    constructor(courtUseCases: CourtUseCases) {
        this.courtUseCases = courtUseCases;
    }

    createCourt = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const courtData = (req as any).courtData ;
        const createdCourt = await this.courtUseCases.createCourt(courtData);
        res.status(201).json(formatJson({ data: createdCourt, message: req.t("Court created successfully", { ns: "common" }), status: true })); 
    });
    getAllCourts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { data, pagination } = await this.courtUseCases.getAllCourts(req.query as Record<string, any>);
        res.status(200).json(formatJson({ data: { list: data, paginationResult: pagination }, message: req.t("Courts fetched successfully", { ns: "common" }), status: true }));
    })
    getCourtById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const
         courtId = req.params.id as string;
        const court = await this.courtUseCases.getCourtById(courtId);
        res.status(200).json(formatJson({ data: court, message: req.t("Court fetched successfully", { ns: "common" }), status: true }));
    })
    getMostSeenCourts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const courts = await this.courtUseCases.getMostSeenCourts(req.query as Record<string, any>);
        res.status(200).json(formatJson({ data: courts, message: req.t("Courts fetched successfully", { ns: "common" }), status: true }));
    })
    
}
