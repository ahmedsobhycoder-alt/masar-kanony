import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
// Update the path based on where you saved ApiError
import ApiError  from '../../shared/errors/apiError'; 

const validatorMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    // Gather validation errors from the current request.
    console.log(req.body);
    const errors = validationResult(req);

    // If there are validation errors, respond with the first error message and a 400 status.
    if (!errors.isEmpty()) {
        const errorMessage = errors.array()[0].msg;
        const apiError = new ApiError(400, errorMessage);
        
        res.status(400).json(apiError.getErrorJson());
        return; 
    } 
    
    // If validation passed, continue to the next middleware or route handler.
    next();
};

export default validatorMiddleware;