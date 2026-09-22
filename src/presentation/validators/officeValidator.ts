import {check} from "express-validator";
import validatorMiddleware from "../middlewares/validatorMiddleWare";
import  OfficeModel  from "../../infrastructure/database/models/officeModel";
import  ApiError  from "../../shared/errors/apiError";
import  FloorModel  from "../../infrastructure/database/models/floorModel";
import OfficeTypesModel from "../../infrastructure/database/models/officeTypeModel";
export const createOfficeValidator = [
    check('floor').isMongoId().withMessage('Floor ID must be a valid Mongo ID').custom(async (floorId, { req }) => {
        const floor= await FloorModel.findOne({
            _id : floorId
        })

        if (!floor) {
           throw new ApiError(400, 'Floor does not exist');
        }else{
            req.body.court=floor.court;
        }
    }),
    check("officeType").isMongoId().withMessage("Office type must be a valid Mongo ID").custom(async (officeType, { req }) => {
        const isOfficeTypeExisted= await OfficeTypesModel.exists({
            _id : officeType
        })

        if (!isOfficeTypeExisted) {
            throw new ApiError(400, 'Office type does not exist');
        }
    }),
    check('roomNumber').notEmpty().withMessage('Room number is required'),
    check('locationDirection').notEmpty().withMessage('Location direction is required'),
    check('startingWorkingHours').isString().withMessage('Starting working hours must be a string').trim() ,
    check('endWorkingHours').isString().withMessage('End working hours must be a string').trim() ,
    check('services').isArray().withMessage('Services must be an array'),
    validatorMiddleware
]