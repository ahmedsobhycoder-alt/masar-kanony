import { check } from 'express-validator';
import validatorMiddleware from "../middlewares/validatorMiddleWare";
import RejectionModel from '../../infrastructure/database/models/rejectionModel';
import { throwError } from '../../shared/utils/helpers';

export const createRejectionValidator = [
    check('rejectionReason')
        .notEmpty()
        .withMessage('Rejection reason is required')
        .isLength({ min: 5 })
        .withMessage('Rejection reason must be at least 5 characters')
        .custom(async (value) => {
            const existing = await RejectionModel.findOne({ rejectionReason: value });
            if (existing) {
                throwError(400, 'Rejection reason must be unique');
            }
            return true;
        }),

    check('rejectionMessage')
        .notEmpty()
        .withMessage('Rejection message is required')
        .isLength({ min: 5 })
        .withMessage('Rejection message must be at least 5 characters')
        .custom(async (value) => {
            const existing = await RejectionModel.findOne({ rejectionMessage: value });
            if (existing) {
                throwError(400, 'Rejection message must be unique');
            }
            return true;
        }),

    validatorMiddleware,
];

// Validate Mongo ID parameter
export const getRejectionValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid Rejection ID format')
        .custom(async (id, { req }) => {
            const rejection = await RejectionModel.findById(id);
            if (!rejection) {
                throwError(400, 'Rejection does not exist');
            }
            (req as any).rejection = rejection;
            return true;
        }),
    validatorMiddleware,
];

// Validate Update
export const updateRejectionValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid Rejection ID format')
        .custom(async (id, { req }) => {
            const rejection = await RejectionModel.findById(id);
            if (!rejection) {
                throwError(400, 'Rejection does not exist');
            }
                     (req as any).rejection = rejection;
            return true;
        }),

    check('rejectionReason')
        .optional()
        .isLength({ min: 5 })
        .withMessage('Rejection reason must be at least 5 characters')
        .custom(async (value, { req }) => {
            const existing = await RejectionModel.findOne({
                rejectionReason: value,
                _id: { $ne: req.params?.id },
            });
            if (existing) {
                throwError(400, 'Rejection reason must be unique');
            }
            return true;
        }),

    check('rejectionMessage')
        .optional()
        .isLength({ min: 5 })
        .withMessage('Rejection message must be at least 5 characters')
        .custom(async (value, { req }) => {
            const existing = await RejectionModel.findOne({
                rejectionMessage: value,
                _id: { $ne: req.params?.id },
            });
            if (existing) {
                throwError(400, 'Rejection message must be unique');
            }
            return true;
        }),

    validatorMiddleware,
];

// Validate Delete
export const deleteRejectionValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid Rejection ID format')
        .custom(async (id, { req }) => {
            const rejection = await RejectionModel.findById(id);
            if (!rejection) {
                throwError(400, 'Rejection does not exist');
            }
                     (req as any).rejection = rejection;
            return true;
        }),
    validatorMiddleware,
];