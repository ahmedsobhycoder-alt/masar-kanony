import { formatJson } from "../../shared/utils/formatJson";
import AppConfigUseCases from "../../domain/usecases/appConfigUseCases";
import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
class AppConfigController {
    readonly appConfigUseCases: AppConfigUseCases;
    constructor(appConfigUseCases: AppConfigUseCases) {
        this.appConfigUseCases = appConfigUseCases;
    }
    getAppConfig = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const appConfig = await this.appConfigUseCases.getAppConfig();
        res.status(200).json(formatJson({ data: appConfig, message: "App config fetched successfully", status: true }));    
    })
    createAppConfig = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const appConfigData = req.body;
        const createdAppConfig = await this.appConfigUseCases.createAppConfig(appConfigData);
        res.status(201).json(formatJson({ data: createdAppConfig, message: "App config created successfully", status: true }));
    })


updateAppConfig = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const appConfigData = req.body;
    const updatedAppConfig = await this.appConfigUseCases.updateAppConfig(appConfigData);

    res.status(200).json(
      formatJson({
        data: updatedAppConfig,
        message: "App config updated successfully",
        status: true,
      })
    );
  }
);
}    
export default AppConfigController