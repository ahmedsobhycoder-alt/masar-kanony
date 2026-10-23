import { query } from "express-validator";
import validatorMiddleware from "../middlewares/validatorMiddleWare";
import { Router } from "express";
import { Request, Response, NextFunction } from 'express';

import { CourtController } from "../controllers/courtController";
import { CourtUseCases } from "../../domain/usecases/courtUseCases";
import { addToSavedListValidator, createCourtValidator, getAllMySavedCourts, getCourtByIdValidator, getCourtsValidator } from "../validators/courtValidator";
import { courtRepoImpl } from "../../infrastructure/database/repositories/courtRepoImpl";
import { allowedTo, optionalProtect, protect } from "../middlewares/authMiddleware";
import UserRole from "../../shared/constants/user-roles.enum";
import CourtModel from "../../infrastructure/database/models/courtModel";
import ApiError from "../../shared/errors/apiError";
import asyncHandler from "express-async-handler";
import CourtEntity from "../../domain/entities/courtEntity";
import { resourceIdValidator, resourceUpdateBodyValidator } from "../validators/adminResourceValidator";
const courtRouter = Router({ mergeParams: true });
const courtController = new CourtController(new CourtUseCases({ courtRepo: courtRepoImpl }));
const ensureNotSaved = (req: Request, res: Response, next: NextFunction) => {
    const court = (req as any).court as CourtEntity;
    const user = (req as any).user;

    const alreadySaved = court?.savedBy?.some(
        (_id: any) => _id.toString() === user._id.toString()
    );

    if (alreadySaved) {
        return next(new ApiError(400, 'You have already saved this court'));
    }

    next();
};

// Middleware to ensure the court IS saved before attempting removal
const ensureAlreadySaved = (req: Request, res: Response, next: NextFunction) => {
    const court = (req as any).court as CourtEntity;
    const user = (req as any).user;

    const alreadySaved = court?.savedBy?.some(
        (id: any) => id.toString() === user._id.toString()
    );

    if (!alreadySaved) {
        return next(new ApiError(400, 'Court is not in your saved list'));
    }

    next();
};


courtRouter.get("/activity", protect, allowedTo([UserRole.ADMIN]),
    query("court").optional().isMongoId(),
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    validatorMiddleware, courtController.getActivity);

courtRouter.get("/saved",protect, getAllMySavedCourts ,courtController.getSavedCourts);

// Router
courtRouter.post(
    "/:courtId/save",
    protect,
    allowedTo([UserRole.USER]),
    addToSavedListValidator,
    ensureNotSaved,
    courtController.addToSaved
);

courtRouter.post(
    "/:courtId/remove",
    protect,
    allowedTo([UserRole.USER]),
    addToSavedListValidator,
    ensureAlreadySaved,
    courtController.removeFromSaved // Fixed controller target
); 

courtRouter.post("/", protect, allowedTo([UserRole.ADMIN]), createCourtValidator, courtController.createCourt)
    .put("/:id", protect, allowedTo([UserRole.ADMIN]), resourceIdValidator, resourceUpdateBodyValidator, courtController.updateCourt)
    .delete("/:id", protect, allowedTo([UserRole.ADMIN]), resourceIdValidator, courtController.deleteCourt)
    .get("/mostseen", courtController.getMostSeenCourts).
    get("/:id",optionalProtect ,getCourtByIdValidator, courtController.getCourtById)
    .get("/",optionalProtect, getCourtsValidator, courtController.getAllCourts);




// Middleware to ensure the court is not already saved


export default courtRouter;