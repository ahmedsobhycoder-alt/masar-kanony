"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOfficeValidator = void 0;
const express_validator_1 = require("express-validator");
const validatorMiddleWare_1 = __importDefault(require("../middlewares/validatorMiddleWare"));
const apiError_1 = __importDefault(require("../../shared/errors/apiError"));
const floorModel_1 = __importDefault(require("../../infrastructure/database/models/floorModel"));
const officeTypeModel_1 = __importDefault(require("../../infrastructure/database/models/officeTypeModel"));
exports.createOfficeValidator = [
    (0, express_validator_1.check)('floor').isMongoId().withMessage('Floor ID must be a valid Mongo ID').custom(async (floorId, { req }) => {
        const floor = await floorModel_1.default.findOne({
            _id: floorId
        });
        if (!floor) {
            throw new apiError_1.default(400, 'Floor does not exist');
        }
        else {
            req.body.court = floor.court;
        }
    }),
    (0, express_validator_1.check)("officeType").isMongoId().withMessage("Office type must be a valid Mongo ID").custom(async (officeType, { req }) => {
        const isOfficeTypeExisted = await officeTypeModel_1.default.exists({
            _id: officeType
        });
        if (!isOfficeTypeExisted) {
            throw new apiError_1.default(400, 'Office type does not exist');
        }
    }),
    (0, express_validator_1.check)('roomNumber').notEmpty().withMessage('Room number is required'),
    (0, express_validator_1.check)('locationDirection').notEmpty().withMessage('Location direction is required'),
    (0, express_validator_1.check)('startingWorkingHours').isString().withMessage('Starting working hours must be a string').trim(),
    (0, express_validator_1.check)('endWorkingHours').isString().withMessage('End working hours must be a string').trim(),
    (0, express_validator_1.check)('services').isArray().withMessage('Services must be an array'),
    validatorMiddleWare_1.default
];
