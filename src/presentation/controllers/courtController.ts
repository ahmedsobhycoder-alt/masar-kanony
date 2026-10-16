import { CourtUseCases } from "../../domain/usecases/courtUseCases";
import { Request, Response, NextFunction } from "express";
import { formatJson } from "../../shared/utils/formatJson";
import asyncHandler from "express-async-handler"
import { printBlue, printRed } from "../../shared/utils/printColors";
import CourtEntity from "../../domain/entities/courtEntity";
import listType from "../../shared/constants/types";
import { stringToList } from "../../shared/utils/helpers";

const toFilterValues = (value: unknown): string[] => {
    if (Array.isArray(value)) {
        return value.flatMap(toFilterValues);
    }
    return typeof value === "string" ? stringToList(value) : [];
};

const getCourtOtherQueries = (req: Request): Record<string, string[]> => {
    const governorates = toFilterValues((req as any).governorate ?? req.query.governorate);
    const courtTypes = toFilterValues((req as any).courtType ?? req.query.courtType);
    const otherQueries: Record<string, string[]> = {};

    if (governorates.length) otherQueries.governorate = governorates;
    if (courtTypes.length) otherQueries.courtType = courtTypes;

    return otherQueries;
};

export class CourtController {
    private readonly courtUseCases: CourtUseCases;

    constructor(courtUseCases: CourtUseCases) {
        this.courtUseCases = courtUseCases;
    }

    createCourt = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const courtData = (req as any).courtData;
        const createdCourt = await this.courtUseCases.createCourt(courtData);
        res.status(201).json(formatJson({ data: createdCourt, message: req.t("Court created successfully", { ns: "common" }), status: true }));
    });
    getAllCourts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const otherQueries = getCourtOtherQueries(req);
        printBlue("otherQueries", JSON.stringify(otherQueries));
        const list: listType<CourtEntity> = await this.courtUseCases.getAllCourts(
            (req as any).user?._id,
            req.query as Record<string, any>,
            otherQueries
        );

        res.status(200).json(formatJson({ data: list, message: req.t("Courts fetched successfully", { ns: "common" }), status: true }));
    })
    getSavedCourts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const otherQueries = getCourtOtherQueries(req);

        const list: listType<CourtEntity> = await this.courtUseCases.getSavedCourts(
            req.query as Record<string, any>,
            (req as any).user._id,
            otherQueries
        );
        res.status(200).json(formatJson({
            data: {
                list: list.data
                , paginationResult: list.pagination
            }, message: req.t("Courts fetched successfully", { ns: "common" }), status: true
        }));
    })
    getCourtById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const courtId = req.params.id as string;
        const userId = (req as any).user?._id?.toString();
        const court = await this.courtUseCases.getCourtById(courtId, userId);
        res.status(200).json(formatJson({ data: court, message: req.t("Court fetched successfully", { ns: "common" }), status: true }));
    })
    getMostSeenCourts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const list: listType<CourtEntity> = await this.courtUseCases.getMostSeenCourts(
            (req as any).user?._id,
            req.query as Record<string, any>,
            getCourtOtherQueries(req)
        );
        res.status(200).json(formatJson({ data: list, message: req.t("Courts fetched successfully", { ns: "common" }), status: true }));
    })
    addToSaved = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const court = (req as any).court as CourtEntity;
        const savedCourt = await this.courtUseCases.addToSaved(court,
            (req as any).user._id
        );
        res.status(200).json(formatJson({ data: savedCourt, message: req.t("Court added to saved successfully", { ns: "common" }), status: true }));
    })
    removeFromSaved = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const
            court = (req as any).court as CourtEntity;
        const removedCourt = await this.courtUseCases.removeFromSaved(court,
            (req as any).user._id
        );
        res.status(200).json(formatJson({ data: removedCourt, message: req.t("Court removed from saved successfully", { ns: "common" }), status: true }));
    })


}
