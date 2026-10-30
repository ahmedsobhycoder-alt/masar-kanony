import OfficeUseCases from "../../domain/usecases/officeUseCases";
import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";

import { formatJson } from "../../shared/utils/formatJson"; 
import ApiError from "../../shared/errors/apiError";
import pickAllowedFields from "../../shared/utils/pickAllowedFields";
import CourtModel from "../../infrastructure/database/models/courtModel";

export default class OfficesController {
    private readonly officeUseCases: OfficeUseCases
    constructor({ officeUseCases }: { officeUseCases: OfficeUseCases }) {
        this.officeUseCases = officeUseCases;
    }
getOfficeQueries = (req: Request): Record<string, any> => {
    const queries: Record<string, any> = {};
    queries.userId = (req as any).user?._id ?? null;
    for (const key of ["name", "courtName", "governorate", "courtType", "court", "floor", "page", "limit", "sort"]) {
        const value = req.query[key];
        if (typeof value === "string" && value.trim()) queries[key] = value.trim();
    }
    return queries;
};

    createOffice = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const floor = (req as any).selectedFloor;
        const officeType = (req as any).selectedOfficeType;
        const court = await CourtModel.findById(floor.court);
        if (!court) throw new ApiError(400, "Court does not exist");
        const allowedFields = [
            "roomNumber", "description", "locationDirection", "startingWorkingHours",
            "endWorkingHours", "services", "mapUrl",
        ];
        const optionalFields = Object.fromEntries(
            allowedFields
                .filter((field) => Object.prototype.hasOwnProperty.call(req.body, field))
                .map((field) => [field, req.body[field]]),
        );
        const officeData = {
            ...optionalFields,
            floor: floor._id,
            floorName: floor.floorName,
            court: court._id,
            courtName: court.name,
            governorate: court.governorate,
            courtType: court.courtType,
            officeType: officeType._id,
            // The selected type is the office name; the client does not send a floor name.
            name: officeType.name,
            // An explicit office description takes precedence over the type description.
            description: req.body.description ?? officeType.description,
        };
        const createdOffice = await this.officeUseCases.createOffice(officeData as any);
        res.status(201).json(formatJson({ data: createdOffice, message: req.t("Office created successfully", { ns: "common" }), status: true }));
    })

    getOffices = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        
        const queries = this.getOfficeQueries(req);
        const { data, pagination } = await this.officeUseCases.getOffices(queries);
        res.status(200).json(formatJson({ data: { list: data, paginationResult: pagination }, message: req.t("Offices fetched successfully", { ns: "common" }), status: true }));
    })

    getSavedOffices = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const queries = this.getOfficeQueries(req);
        const { data, pagination } = await this.officeUseCases.getSavedOffices(queries);
        res.status(200).json(formatJson({ data: { list: data, paginationResult: pagination }, message: req.t("Offices fetched successfully", { ns: "common" }), status: true }));
    })

    updateOffice = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const updates = pickAllowedFields(req.body, [
            "court", "floor", "officeType", "roomNumber", "description", "locationDirection",
            "startingWorkingHours", "endWorkingHours", "services", "mapUrl",
        ]);
        const office = await this.officeUseCases.updateOfficeById(req.params.id as string, updates as any);
        if (!office) throw new ApiError(404, "Office not found");
        res.status(200).json(formatJson({ data: office, message: req.t("Office updated successfully", { ns: "common" }), status: true }));
    })

    deleteOffice = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const office = await this.officeUseCases.deleteOfficeById(req.params.id as string);
        if (!office) throw new ApiError(404, "Office not found");
        res.status(200).json(formatJson({ data: office, message: req.t("Office deleted successfully", { ns: "common" }), status: true }));
    })
    getOfficeById= asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const office = await this.officeUseCases.getOfficeById(req.params.id as string, (req as any).user?._id);
        if (!office) throw new ApiError(404, "Office not found");
        res.status(200).json(formatJson({ data: office, message: req.t("Office fetched successfully", { ns: "common" }), status: true }));
    })

    addToSaved = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const office = (req as any).office;
        const savedOffice = await this.officeUseCases.addToSaved(office, (req as any).user._id);
        res.status(200).json(formatJson({ data: savedOffice, message: req.t("Office added to saved successfully", { ns: "common" }), status: true }));
    })

    removeFromSaved = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const office = (req as any).office;
        const removedOffice = await this.officeUseCases.removeFromSaved(office, (req as any).user._id);
        res.status(200).json(formatJson({ data: removedOffice, message: req.t("Office removed from saved successfully", { ns: "common" }), status: true }));
    })
}
