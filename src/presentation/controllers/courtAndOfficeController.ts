import CourtAndOfficeUseCases from "src/domain/usecases/courtAndOfficeUseCases";
import { Request, Response, NextFunction } from "express";
import { formatJson } from "../../shared/utils/formatJson";
import asyncHandler from "express-async-handler"
import { printBlue, printGreen, printRed } from "../../shared/utils/printColors";
import listType from "../../shared/constants/types";
class CourtAndOfficeController {
    readonly courtAndOfficeUseCases: CourtAndOfficeUseCases;
    constructor(courtAndOfficeUseCases: CourtAndOfficeUseCases) {
        this.courtAndOfficeUseCases = courtAndOfficeUseCases;
    }
    getCourtsAndOffices = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

        const courtsAndOffices = await this.courtAndOfficeUseCases.getCourtsAndOffices({ ...req.query, userId: (req as any).user?._id });

        res.status(200).json(
            formatJson({message: "Courts and Offices fetched successfully",status: true,data: courtsAndOffices })
        );

    });
}
export default CourtAndOfficeController