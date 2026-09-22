import {check} from "express-validator";
import validatorMiddleware from "../middlewares/validatorMiddleWare";
import  CourtModel  from "../../infrastructure/database/models/courtModel";
import  ApiError  from "../../shared/errors/apiError";
import CourtTypeModel from "../../infrastructure/database/models/courtTypeModel";
import GovernorateModel from "../../infrastructure/database/models/governorateModel";
export const createCourtValidator = [
    check('name').notEmpty().withMessage('Court name is required'),
    
    check('address').notEmpty().withMessage('Court address is required'),
    
    check('startingWorkingHours').optional().isString().withMessage('Starting working hours must be a string').notEmpty().withMessage('Starting working must not be empty').trim() ,
    
    check('endWorkingHours').optional().isString().withMessage('End working hours must be a string').notEmpty().withMessage('End working hours must not be empty').trim() ,   
    
    check('courtType').isMongoId().withMessage('Court type must be a valid Mongo ID').custom(async (courtType, { req }) => {
        const isCourtTypeExisted= await CourtTypeModel.exists({
            _id : courtType
        })

        if (!isCourtTypeExisted) {
           throw new ApiError(400, 'Court type does not exist');
        }

    }),
    check('governorate').isMongoId().withMessage('Governorate must be a valid Mongo ID').custom(async (governorate, { req }) => {
        const isGovernorateExisted= await GovernorateModel.exists({
            _id : governorate
        })

        if (!isGovernorateExisted) {
           throw new ApiError(400, 'Governorate does not exist');
        }
    }), 
    validatorMiddleware
]
export const getCourtByIdValidator = [
    check('id').isMongoId().withMessage('Court ID must be a valid Mongo ID').custom(async (id, { req }) => {
        const isCourtExisted= await CourtModel.exists({
            _id : id
        })

        if (!isCourtExisted) {
           throw new ApiError(400, 'Court does not exist');
        }
    }),
    validatorMiddleware
]