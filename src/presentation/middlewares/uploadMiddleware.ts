import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import ApiError from "../../shared/errors/apiError";

export const singleFileUpload = (fieldName: string) => {
    // This line configures Multer to hold the uploaded file temporarily in your server's RAM (Memory) as a raw Buffer object, rather than writing the file to your server's hard drive.
    const storage = multer.memoryStorage();

    const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        // Check if file exists and is an image type
        if (file?.mimetype?.startsWith("image")) {
            cb(null, true);
        } else {
            // Adjust arguments based on how your ApiError class is constructed
            cb(new ApiError(400, "Only image files are allowed!"));
        }
    };
    // This code initializes the Multer middleware instance and configures exactly how it should handle incoming file uploads before passing them to your route handlers.Here is a breakdown of what each property does:
    //     storage: storage: Tells Multer where to hold the uploaded file. Based on your earlier code (multer.memoryStorage()), this instructs Multer to keep the file temporarily in the server's RAM as a Buffer, rather than writing it directly to the hard drive.

    // fileFilter: fileFilter: Attaches your custom validation logic. It runs every incoming file through the fileFilter function you defined earlier to verify its mimetype. If the file is not an image, Multer will reject it before it ever reaches your controller.

    // limits: { fileSize: 2000000 }: Sets a strict security cap on the upload size to prevent malicious users from crashing your server by uploading massive files (especially important since memory storage uses RAM). It restricts the file to a maximum of 2,000,000 bytes (2 MB). If a file exceeds this limit, Multer automatically throws an error.
    const upload = multer({
        storage: storage,
        fileFilter: fileFilter,
        limits: { fileSize: 2000000 }, // Limit size to 2MB for security
    });
    // This line returns the actual Express middleware function that intercepts the incoming HTTP request and processes the file upload.

    // Here is exactly what it does:

    // .single(): Instructs Multer to expect exactly one file in the request. If the user tries to upload multiple files under this field, Multer will throw an error.

    // (fieldName): Tells Multer the specific key (or name) of the form-data field to look for. For example, if fieldName is passed as 'profilePicture', your frontend (or Postman) must send the file using the key profilePicture.

    // Attaches to req.file: Once it finds and processes the file, this middleware attaches the file data to the Express request object as req.file so that your next middleware (like the Sharp image processor) or your controller can access it.
    return upload.single(fieldName);
};

export const multibleFileUpload = (fields: multer.Field[]) => {
    // This line configures Multer to hold the uploaded file temporarily in your server's RAM (Memory) as a raw Buffer object, rather than writing the file to your server's hard drive.
    const storage = multer.memoryStorage();

    const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        // Check if file exists and is an image type
        if (file?.mimetype?.startsWith("image")) {
            cb(null, true);
        } else {
            cb(new ApiError(400, "Only image files are allowed!"));
        }
    };

    const upload = multer({
        storage: storage,
        fileFilter,
        limits: { fileSize: 2000000 },
    });

    return upload.fields(fields);
};
export default singleFileUpload;