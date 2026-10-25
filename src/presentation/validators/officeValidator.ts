import { check } from "express-validator";
import validatorMiddleware from "../middlewares/validatorMiddleWare";
import OfficeModel from "../../infrastructure/database/models/officeModel";
import { fromStringToList, throwError } from "../../shared/utils/helpers";
import FloorModel from "../../infrastructure/database/models/floorModel";
import OfficeTypesModel from "../../infrastructure/database/models/officeTypeModel";
import GovernorateModel from "../../infrastructure/database/models/governorateModel";
import CourtModel from "../../infrastructure/database/models/courtModel";
import CourtTypeModel from "../../infrastructure/database/models/courtTypeModel";
export const createOfficeValidator = [
    check("floor")
        .isMongoId().withMessage("Floor ID must be a valid Mongo ID")
        .custom(async (floorId, { req }) => {
            const floor = await FloorModel.findById(floorId);
            if (!floor) {
                return throwError(400, "Floor does not exist");
            }

            const court = await CourtModel.findById(floor.court);
            if (!court) {
                return throwError(400, "Court does not exist");
            }

            // Safe initialization: do not wipe existing keys added by other parallel checks
            req.office = req.office || {};

            req.office.floor = floor._id;
            req.office.floorName = floor.floorName;
            req.office.court = court._id;
            req.office.courtName = court.name;
            req.office.governorate = court.governorate;
            req.office.courtType = court.courtType;
            return true;
        }),

    check("officeType")
        .isMongoId().withMessage("Office type must be a valid Mongo ID")
        .custom(async (officeType, { req }) => {
            const selectedOfficeType = await OfficeTypesModel.findById(officeType);
            if (!selectedOfficeType) {
                return throwError(400, "Office type does not exist");
            }

            req.office = req.office || {};
            req.office.officeType = selectedOfficeType._id;
            req.office.name = selectedOfficeType.name;
            return true;
        }),

    check("roomNumber")
        .notEmpty().withMessage("Room number is required")
        .custom(async (roomNumber, { req }) => {
            const floorId = req.body.floor;
            if (floorId) {
                const existingOffice = await OfficeModel.findOne({
                    floor: floorId,
                    roomNumber: String(roomNumber).trim(),
                });
                if (existingOffice) {
                    throw new Error("An office with this room number already exists on this floor");
                }
            }

            req.office = req.office || {};
            req.office.roomNumber = String(roomNumber).trim();
            return true;
        }),

    check("locationDirection")
        .optional()
        .isString().withMessage("Location direction must be a string")
        .notEmpty().withMessage("Location direction is required")
        .custom((locationDirection, { req }) => {
            req.office = req.office || {};
            req.office.locationDirection = locationDirection;
            return true;
        }),

    check("startingWorkingHours")
        .optional()
        .isString().withMessage("Starting working hours must be a string")
        .trim()
        .custom((startingWorkingHours, { req }) => {
            req.office = req.office || {};
            req.office.startingWorkingHours = startingWorkingHours;
            return true;
        }),

    check("endWorkingHours")
        .optional()
        .isString().withMessage("End working hours must be a string")
        .trim()
        .custom((endWorkingHours, { req }) => {
            req.office = req.office || {};
            req.office.endWorkingHours = endWorkingHours;
            return true;
        }),

    check("services")
        .optional()
        .isArray().withMessage("Services must be an array")
        .custom((services, { req }) => {
            req.office = req.office || {};
            req.office.services = services;
            return true;
        }),

    ...["description", "mapUrl"].map(field => check(field).optional().isString().custom((value, { req }) => {
        req.office = req.office || {};
        req.office[field] = value;
        return true;
    })),
    validatorMiddleware,
];
export const updateOfficeValidator = [
    ...["floor", "court"].map(field => check(field).optional().isMongoId()),
    check("officeType").optional().isMongoId(),
    check("roomNumber").optional().isString().trim().notEmpty(),
    ...["description", "locationDirection", "startingWorkingHours", "endWorkingHours", "mapUrl"].map(field => check(field).optional().isString()),
    check("services").optional().isArray(),
    check("services.*").optional().isString(),
    validatorMiddleware,
];

export const getOfficeValidator = [
    ...["name", "courtName", "governorate", "courtType"].map(field => check(field).optional().isString().trim()),
    ...["court", "floor"].map(field => check(field).optional().isMongoId()),
    ...["page", "limit"].map(field => check(field).optional().isInt({ min: 1 })),
    validatorMiddleware,
];
