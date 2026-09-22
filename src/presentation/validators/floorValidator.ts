import { check } from "express-validator";
import validatorMiddleware from "../middlewares/validatorMiddleWare";
import CourtModel from "../../infrastructure/database/models/courtModel";
import ApiError from "../../shared/errors/apiError";
import FloorModel from "../../infrastructure/database/models/floorModel";
import FloorNameModel from "../../infrastructure/database/models/floorNameModel";
import { printBlue } from "../../shared/utils/printColors";
export const createFloorValidator = [
    check("court")
        .notEmpty()
        .withMessage("Court ID is required")
        .isMongoId()
        .withMessage("Court ID must be a valid Mongo ID")
        .custom(async (court, { req }) => {
            const isCourtExisted = await CourtModel.exists({
                _id: court,
            });

            if (!isCourtExisted) {
                throw new ApiError(400, "Court does not exist");
            }
        }),
    check("floorName")
        .isMongoId()
        .withMessage("Floor number must be a valid Mongo ID")
        .notEmpty()
        .withMessage("Floor Name Id must not be empty")
        .custom(async (floorName, { req }) => {
            const isFloorNameExisted = await FloorNameModel.exists({
                _id: floorName,
            });

            if (!isFloorNameExisted) {
                throw new ApiError(400, "Floor does not exist");
            }
        }).custom(async (floorName, { req }) => {
            const isFloorNameExistedInFloor = await FloorModel.exists({
                floorName, court: req.body.court
            })

            if (isFloorNameExistedInFloor) {
                throw new ApiError(400, 'Floor Name already exists in Floor');
            }
        }),

    check("images").optional().isArray().withMessage("Images must be an array"),
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
                throw new ApiError(400, "Court does not exist");
            }
            req.filter ={
                court: courtId
            };
        }),

    validatorMiddleware,
];
