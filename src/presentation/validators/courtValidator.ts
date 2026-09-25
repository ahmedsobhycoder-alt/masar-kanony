import { check } from "express-validator";
import validatorMiddleware from "../middlewares/validatorMiddleWare";
import CourtModel from "../../infrastructure/database/models/courtModel";
import ApiError from "../../shared/errors/apiError";
import CourtTypeModel from "../../infrastructure/database/models/courtTypeModel";
import GovernorateModel from "../../infrastructure/database/models/governorateModel";
import { printGreen, printYellow } from "../../shared/utils/printColors";
export const createCourtValidator = [
    check('name').notEmpty().withMessage('Court name is required'),

    check('address').notEmpty().withMessage('Court address is required'),

    check('startingWorkingHours')
        .optional()
        .isString().withMessage('Starting working hours must be a string')
        .notEmpty().withMessage('Starting working must not be empty')
        .trim(),

    check('endWorkingHours')
        .optional()
        .isString().withMessage('End working hours must be a string')
        .notEmpty().withMessage('End working hours must not be empty')
        .trim(),

    check('courtType')
        .isMongoId().withMessage('Court type must be a valid Mongo ID')
        .custom(async (courtType, { req }) => {
            const courtRecord = await CourtTypeModel.findById(courtType);

            if (!courtRecord) {
                throw new ApiError(400, 'Court type does not exist'); // Fixed parameter order
            }

            // 1. Initialize the custom object
            req.courtData = { courtType: courtRecord.name };

            return true; // Signal validation passed
        }),

    check('governorate')
        .isMongoId().withMessage('Governorate must be a valid Mongo ID')
        .custom(async (governorate, { req }) => {
            const governorateRecord = await GovernorateModel.findById(governorate);

            if (!governorateRecord) {
                throw new ApiError(400, 'Governorate does not exist'); // Fixed parameter order
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

    validatorMiddleware
];
export const getCourtByIdValidator = [
    check('id').isMongoId().withMessage('Court ID must be a valid Mongo ID').custom(async (id, { req }) => {
        const isCourtExisted = await CourtModel.exists({
            _id: id
        })

        if (!isCourtExisted) {
            throw new ApiError(400, 'Court does not exist');
        }
    }),
    validatorMiddleware
]