import { check } from "express-validator";
import validatorMiddleware from "../middlewares/validatorMiddleWare";
import ApiError from "../../shared/errors/apiError";
export const createAppConfigValidator = [
  check("appName")
    .trim()
    .notEmpty()
    .withMessage("App name is required"),
  check("appVersion").trim().notEmpty().withMessage("App version is required"),

  check("description")
    .trim()
    .notEmpty()
    .withMessage("App description is required"),

  check("contactInfo")
    .notEmpty()
    .withMessage("Contact info object is required"),

  check("contactInfo.whatsappNumber")
    .trim()
    .notEmpty()
    .withMessage("WhatsApp number is required")
    .matches(/^01[0125][0-9]{8}$/)
    .withMessage("WhatsApp number must be an 11-digit Egyptian phone number"),

  check("contactInfo.email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),


  check("socialMediaLinks.facebook")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("Facebook link must be a valid URL"),

  check("socialMediaLinks.instagram")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("Instagram link must be a valid URL"),

  validatorMiddleware,
];
export const updateAppConfigValidator = [
  check("appName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("App name cannot be empty")
    .isLength({ min: 2, max: 50 })
    .withMessage("App name must be between 2 and 50 characters"),
  check("appVersion")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("App version cannot be empty"),
  check("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("App description cannot be empty"),

  check("contactInfo")
    .optional()
    .isObject()
    .withMessage("Contact info must be a valid object"),

  check("contactInfo.whatsappNumber")
    .optional()
    .trim()
    .isString()
    .withMessage("WhatsApp number must be a string")
    .matches(/^01[0125][0-9]{8}$/)
    .withMessage("WhatsApp number must be an 11-digit Egyptian phone number"),
  check("contactInfo.workingHours")
    .optional()
    .trim()
    .isString()
    .withMessage("Working hours must be a string")
    .notEmpty()
    .withMessage("Working hours cannot be empty"),
  check("contactInfo.email")
    .optional()
    .trim()
    .isString().withMessage("Email must be a string")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

  check("socialMediaLinks")
    .optional()
    .isObject()
    .withMessage("Social media links must be a valid object"),

  check("socialMediaLinks.facebook")
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage("Facebook link must be a valid URL"),

  check("socialMediaLinks.instagram")
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage("Instagram link must be a valid URL"),

  validatorMiddleware,
];