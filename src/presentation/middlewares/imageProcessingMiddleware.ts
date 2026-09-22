import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { singleFileUpload, multibleFileUpload } from "./uploadMiddleware";
import fs from "fs"; // Import Node's file system module
interface UploadField {
    name: string;
    maxCount: number;
    pathInDisk: string;
}

const getFileName = (pathInDisk: string, extension: string, index?: number): string => {
    const uniqueId = uuidv4();
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
export const uploadSingleImageAndDoIMageProcessing = (fieldName: string, pathInDisk: string) => {
    return [
        singleFileUpload(fieldName),
        asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
            if (req.file) {
                console.log(`File uploaded: ${req.file.originalname}`);
                // 1. Create the directory if it doesn't exist
        if (!fs.existsSync(pathInDisk)) {
            fs.mkdirSync(pathInDisk, { recursive: true }); 
        }
                const fileName = getFileName(pathInDisk, "jpeg");

                await sharp(req.file.buffer)
                    .resize(300, 300)
                    .toFormat("jpeg")
                    .jpeg({ quality: 50 })
                    .toFile(`${pathInDisk}/${fileName}`);

                req.body[fieldName] = fileName;
            }
            next();
        }),
    ];
};

export const uploadMultipleImagesAndDoIMageProcessing = (fields: UploadField[]) => {
    const multerFields = fields.map(({ pathInDisk, ...rest }) => rest);

    return [
        multibleFileUpload(multerFields),
        asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
            if (req.files) {
                // Await all field processing
                await Promise.all(
                    fields.map(async ({ name, maxCount, pathInDisk }) => {
                        // Type assertion for req.files when using multiple fields
                        const files = (req.files as { [fieldname: string]: Express.Multer.File[] })[name];

                        if (files && files.length > 0) {
                            // Await all files within this specific field to finish processing
                            const imagesPathes = await Promise.all(
                                files.map(async (file, i) => {
                                    const fileName = getFileName(pathInDisk, "jpeg", maxCount > 1 ? i : undefined);

                                    await sharp(file.buffer)
                                        .resize(300, 300)
                                        .toFormat("jpeg")
                                        .jpeg({ quality: 50 })
                                        .toFile(`${pathInDisk}/${fileName}`);

                                    return fileName;
                                })
                            );

                            req.body[name] = maxCount > 1 ? imagesPathes : imagesPathes[0];
                        }
                    })
                );
            }
            next();
        }),
    ];
};
export default uploadSingleImageAndDoIMageProcessing;