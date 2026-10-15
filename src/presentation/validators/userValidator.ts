import { check } from "express-validator";
import validatorMiddleware from "../middlewares/validatorMiddleWare";
import UserModel from "src/infrastructure/database/models/userModel";
import { throwError } from "src/shared/utils/helpers";
import UserUtils from "src/shared/utils/userUtils";

export const getUserByIdValidator = [
    check("id").isMongoId().withMessage("User ID must be a valid Mongo ID"),
    validatorMiddleware,
];

export const deleteUserByIdValidator = [
    check("id").isMongoId().withMessage("User ID must be a valid Mongo ID"),
    validatorMiddleware,
];
export const updateUserValidator = [
    // name
    check('name').optional().isString().withMessage('Name must be a string'),
    //phone
    check('phone')
        .optional()
        .isMobilePhone('ar-EG').isString().withMessage('Phone must be a string').
        isLength({ min: 11, max: 11 }).withMessage('Phone must be 11 digits'),
    //email
    check('email').optional().isEmail().withMessage('Email must be a valid email').normalizeEmail().isEmail().withMessage('Email must be a valid email').custom(async (email) => {
        const isEmailExisted = await UserModel.exists({ email });
        if (isEmailExisted) {
            return throwError(400, "Email already exists");
        }
    }),


    check('password').optional().isString().withMessage('Password must be a string').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    validatorMiddleware,

    //password
]
export const verifyEmailValidator = [

    check("otp").isLength({ min: 4 }).withMessage("OTP must be 4 digits").trim().custom(async (otp, { req }) => {
        const user = (req as any).user;
        const hashedInputOtp = UserUtils.hashOtp(otp);
        if (hashedInputOtp !== user.emailChangeOtp) {
            throwError(400, "Invalid verification code");
        }
    }),
    validatorMiddleware
]
