"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFloorsValidator = exports.createFloorValidator = void 0;
const express_validator_1 = require("express-validator");
const validatorMiddleWare_1 = __importDefault(require("../middlewares/validatorMiddleWare"));
const courtModel_1 = __importDefault(require("../../infrastructure/database/models/courtModel"));
const apiError_1 = __importDefault(require("../../shared/errors/apiError"));
const floorModel_1 = __importDefault(require("../../infrastructure/database/models/floorModel"));
const floorNameModel_1 = __importDefault(require("../../infrastructure/database/models/floorNameModel"));
const printColors_1 = require("../../shared/utils/printColors");
exports.createFloorValidator = [
    (0, express_validator_1.check)("court")
        .notEmpty()
        .withMessage("Court ID is required")
        .isMongoId()
        .withMessage("Court ID must be a valid Mongo ID")
        .custom(async (court) => {
        const isCourtExisted = await courtModel_1.default.exists({ _id: court });
        if (!isCourtExisted) {
            // express-validator will catch this and use the string as the error message
            throw new Error("Court does not exist");
        }
        return true;
    }),
    (0, express_validator_1.check)("floorName")
        .notEmpty()
        .withMessage("Floor Name ID is required")
        .isMongoId()
        .withMessage("Floor Name ID must be a valid Mongo ID")
        .custom(async (floorName, { req }) => {
        // 1. Verify the floor name exists in the master list
        const floorRecord = await floorNameModel_1.default.findById(floorName);
        if (!floorRecord) {
            throw new Error("Floor does not exist");
        }
        // 2. Verify this specific floor isn't already assigned to this court
        const isDuplicate = await floorModel_1.default.exists({
            floorName,
            court: req.body.court
        });
        if (isDuplicate) {
            throw new Error("This floor already exists in the specified court");
        }
        // 3. Attach to request for the controller (Pragmatic approach to save DB calls)
        req.floorName = floorRecord.name;
        (0, printColors_1.printGreen)("req.floorName", req.floorName);
        return true;
    }),
    (0, express_validator_1.check)("image").notEmpty().withMessage("Image is required"),
    validatorMiddleWare_1.default,
];
exports.getFloorsValidator = [
    (0, express_validator_1.check)("courtId")
        .optional()
        .isMongoId()
        .withMessage("Court ID must be a valid Mongo ID")
        .custom(async (courtId, { req }) => {
        (0, printColors_1.printBlue)("courtId", courtId);
        const isCourtExisted = await courtModel_1.default.exists({
            _id: courtId,
        });
        if (!isCourtExisted) {
            throw new apiError_1.default(400, "Court does not exist");
        }
        req.filter = {
            court: courtId
        };
    }),
    validatorMiddleWare_1.default,
];
