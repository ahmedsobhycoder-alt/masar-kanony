"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourtByIdValidator = exports.getCourtsValidator = exports.createCourtValidator = void 0;
const express_validator_1 = require("express-validator");
const validatorMiddleWare_1 = __importDefault(require("../middlewares/validatorMiddleWare"));
const courtModel_1 = __importDefault(require("../../infrastructure/database/models/courtModel"));
const apiError_1 = __importDefault(require("../../shared/errors/apiError"));
const courtTypeModel_1 = __importDefault(require("../../infrastructure/database/models/courtTypeModel"));
const governorateModel_1 = __importDefault(require("../../infrastructure/database/models/governorateModel"));
exports.createCourtValidator = [
    (0, express_validator_1.check)('name').notEmpty().withMessage('Court name is required'),
    (0, express_validator_1.check)('address').notEmpty().withMessage('Court address is required'),
    (0, express_validator_1.check)('startingWorkingHours')
        .optional()
        .isString().withMessage('Starting working hours must be a string')
        .notEmpty().withMessage('Starting working must not be empty')
        .trim(),
    (0, express_validator_1.check)('endWorkingHours')
        .optional()
        .isString().withMessage('End working hours must be a string')
        .notEmpty().withMessage('End working hours must not be empty')
        .trim(),
    (0, express_validator_1.check)('courtType')
        .isMongoId().withMessage('Court type must be a valid Mongo ID')
        .custom(async (courtType, { req }) => {
        const courtRecord = await courtTypeModel_1.default.findById(courtType);
        if (!courtRecord) {
            throw new apiError_1.default(400, 'Court type does not exist'); // Fixed parameter order
        }
        // 1. Initialize the custom object
        req.courtData = { courtType: courtRecord.name };
        return true; // Signal validation passed
    }),
    (0, express_validator_1.check)('governorate')
        .isMongoId().withMessage('Governorate must be a valid Mongo ID')
        .custom(async (governorate, { req }) => {
        const governorateRecord = await governorateModel_1.default.findById(governorate);
        if (!governorateRecord) {
            throw new apiError_1.default(400, 'Governorate does not exist'); // Fixed parameter order
        }
        // 2. Merge new data with the existing req.courtData
        req.courtData = {
            ...req.courtData,
            name: req.body.name,
            address: req.body.address,
            startingWorkingHours: req.body.startingWorkingHours,
            endWorkingHours: req.body.endWorkingHours,
            governorate: governorateRecord.name
        };
        return true; // Signal validation passed
    }),
    validatorMiddleWare_1.default
];
exports.getCourtsValidator = [
    (0, express_validator_1.check)('name').optional().isString().withMessage('Court name must be a string'),
    (0, express_validator_1.check)('address').optional().isString().withMessage('Court address must be a string'),
    (0, express_validator_1.check)('courtType').optional().isString().withMessage('Court type must be a valid String'),
    (0, express_validator_1.check)('governorate').optional().isString().withMessage('Governorate must be a valid String'),
    (0, express_validator_1.check)('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
    (0, express_validator_1.check)('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    validatorMiddleWare_1.default
];
exports.getCourtByIdValidator = [
    (0, express_validator_1.check)('id').isMongoId().withMessage('Court ID must be a valid Mongo ID').custom(async (id, { req }) => {
        const isCourtExisted = await courtModel_1.default.exists({
            _id: id
        });
        if (!isCourtExisted) {
            throw new apiError_1.default(400, 'Court does not exist');
        }
    }),
    validatorMiddleWare_1.default
];
