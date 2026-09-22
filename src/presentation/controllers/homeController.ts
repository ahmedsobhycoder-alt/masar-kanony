import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";

import { HomeUseCases } from "../../domain/usecases/homeUseCases";
import { formatJson } from "../../shared/utils/formatJson";

export class HomeController {
  private readonly homeUseCases: HomeUseCases;

  constructor(homeUseCases: HomeUseCases) {
    this.homeUseCases = homeUseCases;
  }

  getHomeData = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const homeData = await this.homeUseCases.getHomeData();

    res.status(200).json(
      formatJson({
        data: homeData,
        message: "Home data fetched successfully",
        status: "success",
      })
    );
  });
}
