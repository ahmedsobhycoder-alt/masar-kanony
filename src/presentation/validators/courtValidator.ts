import { check } from "express-validator";
import validatorMiddleware from "../middlewares/validatorMiddleWare";
import CourtModel from "../../infrastructure/database/models/courtModel";
import CourtTypeModel from "../../infrastructure/database/models/courtTypeModel";
import GovernorateModel from "../../infrastructure/database/models/governorateModel";
import { printGreen, printYellow } from "../../shared/utils/printColors";
import { stringToList, throwError } from "../../shared/utils/helpers";
export const createCourtValidator = [
    check("name").notEmpty().withMessage("Court name is required"),

    check("address").notEmpty().withMessage("Court address is required"),

    check("startingWorkingHours")
        .optional()
        .isString()
        .withMessage("Starting working hours must be a string")
        .notEmpty()
        .withMessage("Starting working must not be empty")
        .trim(),

    check("endWorkingHours")
        .optional()
        .isString()
        .withMessage("End working hours must be a string")
        .notEmpty()
        .withMessage("End working hours must not be empty")
        .trim(),

    check("courtType")
        .isMongoId()
        .withMessage("Court type must be a valid Mongo ID")
        .custom(async (courtType, { req }) => {
            const courtRecord = await CourtTypeModel.findById(courtType);

            if (!courtRecord) {
                return throwError(400, "Court type does not exist");
            }

            // 1. Initialize the custom object
            req.courtData = { courtType: courtRecord.name };

            return true; // Signal validation passed
        }),

    check("governorate")
        .isMongoId()
        .withMessage("Governorate must be a valid Mongo ID")
        .custom(async (governorate, { req }) => {
            const governorateRecord = await GovernorateModel.findById(governorate);

            if (!governorateRecord) {
                return throwError(400, "Governorate does not exist");
            }

            // 2. Merge new data with the existing req.courtData
            req.courtData = {
                ...req.courtData,
                name: req.body.name,
                address: req.body.address,
                startingWorkingHours: req.body.startingWorkingHours,
                endWorkingHours: req.body.endWorkingHours,
                governorate: governorateRecord.name,
            };

            return true; // Signal validation passed
        }),

    validatorMiddleware,
];
export const getCourtsValidator = [
    check("name")
        .optional()
        .isString()
        .withMessage("Court name must be a string"),
    check("address")
        .optional()
        .isString()
        .withMessage("Court address must be a string"),
    check("courtType")
        .optional()
        .isString()
        .withMessage("Court type must be a valid String").bail()
        .customSanitizer((value: string) => stringToList(value))
        .custom(async (courtTypes: string[], { req }) => {
            if (courtTypes.length === 0) {
                throwError(400, "At least one valid court type must be provided");
            }

            const uniqueInputs = Array.from(new Set(courtTypes));

            // Match case-insensitively
            const regexList = uniqueInputs.map((type) => new RegExp(`^${type}$`, "i"));
            const validCourtTypes = await CourtTypeModel.find({
                name: { $in: regexList },
            }).select("-_id name");

            if (validCourtTypes.length !== uniqueInputs.length) {
                const foundNames = validCourtTypes.map((ct) => ct.name.toLowerCase());
                const invalidTypes = uniqueInputs.filter(
                    (type) => !foundNames.includes(type.toLowerCase()),
                );

                return throwError(400, `Invalid court type(s): ${invalidTypes.join(", ")}`);
            }

            printGreen("courtTypes value", courtTypes);
            printGreen("uniqueInputs", uniqueInputs);
            printGreen("validCourtTypes", validCourtTypes);

            // Update req.query so the QueryBuilder picks up the clean array directly
            (req as any).courtType = uniqueInputs;

            return true;
        }),


    check("governorate")
        .optional()
        .isString()
        .withMessage("Governorate must be a string")
        .bail()
        .customSanitizer((value: string) => stringToList(value))
        .custom(async (governorates: string[], { req }) => {
            if (governorates.length === 0) {

                throwError(400, "At least one valid governorate must be provided");
            }

            const uniqueInputs = Array.from(new Set(governorates));

            // Match case-insensitively
            const regexList = uniqueInputs.map((gov) => new RegExp(`^${gov}$`, "i"));
            const validGovernorates = await GovernorateModel.find({
                name: { $in: regexList },
            }).select("-_id name");

            if (validGovernorates.length !== uniqueInputs.length) {
                const foundNames = validGovernorates.map((g) => g.name.toLowerCase());
                const invalidGovs = uniqueInputs.filter(
                    (gov) => !foundNames.includes(gov.toLowerCase()),
                );

                return throwError(400, `Invalid governorate(s): ${invalidGovs.join(", ")}`);
            }
            printGreen('value', governorates);
            printGreen('uniqueInputs', uniqueInputs);
            printGreen('validGovernorates', validGovernorates);



            (req as any).governorate = uniqueInputs;
            printGreen('value', req.governorate);

            return true;
        }),

    check("limit")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Limit must be a positive integer"),
    check("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer"),
    validatorMiddleware,
];
export const getCourtByIdValidator = [
    check("id")
        .isMongoId()
        .withMessage("Court ID must be a valid Mongo ID")
        .custom(async (id, { req }) => {
            const isCourtExisted = await CourtModel.exists({
                _id: id,
            });

            if (!isCourtExisted) {
                return throwError(400, "Court does not exist");
            }
        }),
    validatorMiddleware,
];
export const addToSavedListValidator = [
    check("courtId")
        .isMongoId()
        .withMessage("Court ID must be a valid ID")
        .custom(async (courtId, { req }) => {
            const court = await CourtModel.findById({
                _id: courtId,
            }).lean();
            if (!court) {
                return throwError(400, "Court does not exist");
            }
            req.court = court;
        }),
    validatorMiddleware,
];
export const removeFromSavedList = [
    check("courtId")
        .isMongoId()
        .withMessage("Court ID must be a valid ID")
        .custom(async (courtId, { req }) => {
            const court = CourtModel.findById(courtId);
            if (!court) {
                return throwError(400, "Court does not exist");
            }
            req.court = court;
        }),
    validatorMiddleware,
];
export const getAllMySavedCourts = [
    check("limit")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Limit must be a positive integer"),
    check("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer"),
    check("name")
        .optional()
        .isString()
        .withMessage("Court name must be a string"),
    check("address")
        .optional()
        .isString()
        .withMessage("Court address must be a string"),
    check("courtType")
        .optional()
        .isString()
        .withMessage("Court type must be a valid String"),
    check("governorate")
        .optional()
        .isString()
        .withMessage("Governorate must be a valid String"),
    validatorMiddleware,
];
