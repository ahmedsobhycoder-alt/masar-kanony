import { CourtUseCases } from "../../domain/usecases/courtUseCases";
import { Request, Response, NextFunction } from "express";
import { formatJson } from "../../shared/utils/formatJson";
import asyncHandler from "express-async-handler"
import { printBlue, printGreen, printRed } from "../../shared/utils/printColors";
import listType from "../../shared/constants/types";
import CourtEntity from "../../domain/entities/courtEntity";

import { fromStringToList } from "../../shared/utils/helpers";
import ApiError from "../../shared/errors/apiError";
import pickAllowedFields from "../../shared/utils/pickAllowedFields";


import { auditCourtAction } from "../../shared/utils/courtActivity";
import CourtActivity from "../../infrastructure/database/models/courtActivityModel";
import { QueryBuilder } from "../../shared/utils/queryBuilder";

export class CourtController {
    private readonly courtUseCases: CourtUseCases;

    constructor(courtUseCases: CourtUseCases) {
        this.courtUseCases = courtUseCases;
    }


    getCourtQueries = (req: Request): Record<string, any> => {
        // 1. Debug what actually arrives on the request
        console.log("Incoming req.query:", req.query);
        console.log("Incoming req.user:", (req as any).user);

        const rawGov = (req as any).governorate ?? req.query.governorate;
        const rawCourtType = (req as any).courtType ?? req.query.courtType;
        const rawName = (req as any).name ?? req.query.name;

        const governorates = fromStringToList(rawGov);
        const courtTypes = fromStringToList(rawCourtType);

        const queries: Record<string, any> = {};

        // Only assign userId if it actually exists
        const userId = (req as any).user?._id ?? null;
        queries.userId = userId;


        // Capture name from either middleware attachment or URL query
        if (rawName && typeof rawName === "string" && rawName.trim()) {
            queries.name = rawName.trim();
        }

        if (governorates.length) queries.governorate = governorates;
        if (courtTypes.length) queries.courtType = courtTypes;

        for (const field of ["page", "limit", "sort", "address"]) {
            const value = req.query[field];
            if (typeof value === "string" && value.trim()) queries[field] = value.trim();
        }

        printGreen("otherQueries", JSON.stringify(queries));

        return queries;
    };

    getActivity = asyncHandler(async (req: Request, res: Response) => {
        const { page, limit, court } = req.query;
        const queries = { page, limit, status: { $eq: "completed" }, ...(court ? { court } : {}) };
        const result = await new QueryBuilder(CourtActivity, queries).filter().sort().paginate().execute();
        res.json(formatJson({ data: { list: result.data, paginationResult: result.pagination }, message: "Court activity", status: true }));
    });

    getAllCourts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const queries = this.getCourtQueries(req);

        printBlue("otherQueries", JSON.stringify(queries));
        const list: listType<CourtEntity> = await this.courtUseCases.getAllCourts(
            queries
        );

        res.status(200).json(formatJson({ data: { list: list.data, paginationResult: list.pagination }, message: req.t("Courts fetched successfully", { ns: "common" }), status: true }));
    })
    createCourt = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const courtData = (req as any).courtData;
        const createdCourt = await auditCourtAction((req as any).user, "created", undefined, () => this.courtUseCases.createCourt(courtData));
        res.status(201).json(formatJson({ data: createdCourt, message: req.t("Court created successfully", { ns: "common" }), status: true }));
    });
    updateCourt = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const updates = pickAllowedFields(req.body, [
            "name", "address", "governorate", "courtType", "startingWorkingHours", "endWorkingHours",
        ]);
        const updatedCourt = await auditCourtAction((req as any).user, "updated", req.params.id as string, () => this.courtUseCases.updateCourtById(req.params.id as string, updates as any));
        if (!updatedCourt) throw new ApiError(404, "Court not found");
        res.status(200).json(formatJson({ data: updatedCourt, message: req.t("Court updated successfully", { ns: "common" }), status: true }));
    });
    deleteCourt = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const deletedCourt = await auditCourtAction((req as any).user, "deleted", req.params.id as string, () => this.courtUseCases.deleteCourtById(req.params.id as string));
        if (!deletedCourt) throw new ApiError(404, "Court not found");
        res.status(200).json(formatJson({ data: deletedCourt, message: req.t("Court deleted successfully", { ns: "common" }), status: true }));
    });

    getSavedCourts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const queries = this.getCourtQueries(req);

        const list: listType<CourtEntity> = await this.courtUseCases.getSavedCourts(
            queries
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

            this.getCourtQueries(req)
        );
        res.status(200).json(formatJson({ data: { list: list.data, paginationResult: list.pagination }, message: req.t("Courts fetched successfully", { ns: "common" }), status: true }));
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
