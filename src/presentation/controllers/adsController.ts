import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";

import { AdsUseCases } from "../../domain/usecases/adsUseCases";
import { formatJson } from "../../shared/utils/formatJson";

export class AdsController {
  private readonly adsUseCases: AdsUseCases;

  constructor(adsUseCases: AdsUseCases) {
    this.adsUseCases = adsUseCases;
  }

  createAd = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const adData = req.body;
    const createdAd = await this.adsUseCases.createAd(adData);
    res.status(201).json(
      formatJson({
        data: createdAd,
        message: "Ad created successfully",
        status: true,
      })
    );
  });

  getAllAds = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { data, pagination } = await this.adsUseCases.getAds(req.query as Record<string, any>);
    res.status(200).json(
      formatJson({
        data: { list: data, paginationResult: pagination },
        message: "Ads fetched successfully",
        status: true,
      })
    );
  });

  getAdById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const adId = req.params.id as string;
    const ad = await this.adsUseCases.getAdById(adId);
    res.status(200).json(
      formatJson({
        data: ad,
        message: "Ad fetched successfully",
        status: true,
      })
    );
  });
  deleteAdById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const adId = req.params.id as string;
    const deletedAd = await this.adsUseCases.deleteAdById(adId);
    res.status(200).json(
      formatJson({
        data: deletedAd,
        message: "Ad deleted successfully",
        status: true,
      })
    );
  });
}
