import { body, check } from "express-validator";
import validatorMiddleware from "../middlewares/validatorMiddleWare";
import CourtModel from "../../infrastructure/database/models/courtModel";
import { throwError } from "../../shared/utils/helpers";
import FloorModel from "../../infrastructure/database/models/floorModel";
import FloorNameModel from "../../infrastructure/database/models/floorNameModel";
import { printBlue, printGreen } from "../../shared/utils/printColors";

export const createFloorValidator = [
    check("court")
        .notEmpty()
        .withMessage("Court ID is required")
        .isMongoId()
        .withMessage("Court ID must be a valid Mongo ID")
        .custom(async (court) => {
            const isCourtExisted = await CourtModel.exists({ _id: court });

            if (!isCourtExisted) {
                throw new Error("Court does not exist");
            }
            return true;
        }),

    check("floorName")
        .notEmpty()
        .withMessage("Floor Name ID is required")
        .isMongoId()
        .withMessage("Floor Name ID must be a valid Mongo ID")
        .custom(async (floorName, { req }) => {
            const floorRecord = await FloorNameModel.findById(floorName);
            if (!floorRecord) {
                throw new Error("Floor does not exist");
            }

            const isDuplicate = await FloorModel.exists({
                floorName,
                court: req.body.court
            });

            if (isDuplicate) {
                throw new Error("This floor already exists in the specified court");
            }

            req.floorName = floorRecord.name;
            printGreen("req.floorName", req.floorName);

            return true;
        }),
    check("image").notEmpty().withMessage("Image is required"),

    validatorMiddleware,
];
export const updateFloorValidator = [
    check("floorName").optional().isString().bail().trim().notEmpty()
        .withMessage("Floor name is required")
        .custom(async (floorName, { req }) => {
            const floor = await FloorModel.findById(req.params?.id);
            if (!floor) throw new Error("Floor not found");
            const duplicate = await FloorModel.exists({
                court: floor.court, floorName, _id: { $ne: floor._id },
            });
            if (duplicate) throw new Error("This floor already exists in the specified court");
            return true;
        }),
    check("image").optional().custom((image, { req }) => {
        if (!req.file) throw new Error("Upload an image file to replace the floor image");
        return true;
    }),
    body().custom((data) => {
        if (data.floorName === undefined && data.image === undefined) {
            throw new Error("At least one update field is required");
        }
        return true;
    }),
    validatorMiddleware,
];

export const getFloorsValidator = [
    check("courtId")
        .optional()
        .isMongoId()
        .withMessage("Court ID must be a valid Mongo ID")
        .custom(async (courtId, { req }) => {
            printBlue("courtId", courtId);
            const isCourtExisted = await CourtModel.exists({
                _id: courtId,
            });

            if (!isCourtExisted) {
                return throwError(400, "Court does not exist");
            }
            req.filter = {
                court: courtId
            };
        }),

    validatorMiddleware,
];
