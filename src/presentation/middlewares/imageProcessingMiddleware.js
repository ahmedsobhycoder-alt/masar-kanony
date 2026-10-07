"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultipleImagesAndDoIMageProcessing = exports.uploadSingleImageAndDoIMageProcessing = void 0;
const uuid_1 = require("uuid");
const sharp_1 = __importDefault(require("sharp"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const uploadMiddleware_1 = require("./uploadMiddleware");
const fs_1 = __importDefault(require("fs")); // Import Node's file system module
const getFileName = (pathInDisk, extension, index) => {
    const uniqueId = (0, uuid_1.v4)();
    const moduleName = pathInDisk.split("/").at(-1) || "image";
    const suffix = index !== undefined ? `-${index + 1}` : "";
    return `${moduleName}-${uniqueId}-${Date.now()}${suffix}.${extension}`;
};
// This code defines an array of two sequential middlewares that run one after the other to handle a file upload and process the image before it reaches your controller.
// Here is the exact step-by-step execution:
// 1. singleFileUpload(fieldName)
// This is the Multer middleware. It intercepts the incoming HTTP request and looks for a file attached to the specific fieldName (e.g., 'profilePicture').
// It grabs that file, verifies it is an image (using your fileFilter), ensures it is under 2MB, and temporarily stores it in the server's RAM.
// It then attaches that raw file data to the Express request object as req.file and passes control to the next middleware.
// 2. The Custom asyncHandler Middleware
// This second middleware kicks in immediately after Multer finishes:
// if (req.file): It checks if a file was actually uploaded. If the user didn't upload a file, it skips the processing block entirely.
// getFileName(...): It generates a unique, safe filename using the UUID logic you created earlier.
// await sharp(req.file.buffer): It takes the raw file buffer out of RAM (req.file.buffer), hands it to the Sharp image processing library, forces it into a 300x300 pixel square, converts the format to JPEG, compresses the quality to 50% to save space, and finally writes it to your server's hard drive at the specified pathInDisk.
// req.body[fieldName] = fileName: This is the most crucial integration step. It takes the newly generated filename (e.g., image-1234-uuid.jpeg) and injects it into req.body. By doing this, your database controllers and validators can treat the image upload exactly as if the client had just sent a standard text string.
// next(): This tells Express that this middleware is finished, allowing the request to proceed to your validators and eventually your final Controller (e.g., floorController.createOne).
const uploadSingleImageAndDoIMageProcessing = (fieldName, pathInDisk) => {
    return [
        (0, uploadMiddleware_1.singleFileUpload)(fieldName),
        (0, express_async_handler_1.default)(async (req, res, next) => {
            if (req.file) {
                console.log(`File uploaded: ${req.file.originalname}`);
                // 1. Create the directory if it doesn't exist
                if (!fs_1.default.existsSync(pathInDisk)) {
                    fs_1.default.mkdirSync(pathInDisk, { recursive: true });
                }
                const fileName = getFileName(pathInDisk, "jpeg");
                await (0, sharp_1.default)(req.file.buffer)
                    .toFormat("jpeg")
                    .jpeg({ quality: 70 })
                    .toFile(`${pathInDisk}/${fileName}`);
                req.body[fieldName] = fileName;
            }
            next();
        }),
    ];
};
exports.uploadSingleImageAndDoIMageProcessing = uploadSingleImageAndDoIMageProcessing;
const uploadMultipleImagesAndDoIMageProcessing = (fields) => {
    const multerFields = fields.map(({ pathInDisk, ...rest }) => rest);
    return [
        (0, uploadMiddleware_1.multibleFileUpload)(multerFields),
        (0, express_async_handler_1.default)(async (req, res, next) => {
            if (req.files) {
                // Await all field processing
                await Promise.all(fields.map(async ({ name, maxCount, pathInDisk }) => {
                    // Type assertion for req.files when using multiple fields
                    const files = req.files[name];
                    if (files && files.length > 0) {
                        // Await all files within this specific field to finish processing
                        const imagesPathes = await Promise.all(files.map(async (file, i) => {
                            const fileName = getFileName(pathInDisk, "jpeg", maxCount > 1 ? i : undefined);
                            await (0, sharp_1.default)(file.buffer)
                                .resize(300, 300)
                                .toFormat("jpeg")
                                .jpeg({ quality: 50 })
                                .toFile(`${pathInDisk}/${fileName}`);
                            return fileName;
                        }));
                        req.body[name] = maxCount > 1 ? imagesPathes : imagesPathes[0];
                    }
                }));
            }
            next();
        }),
    ];
};
exports.uploadMultipleImagesAndDoIMageProcessing = uploadMultipleImagesAndDoIMageProcessing;
exports.default = exports.uploadSingleImageAndDoIMageProcessing;
