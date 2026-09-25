import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";

import { CityUseCases } from "../../domain/usecases/cityUseCases";
import { formatJson } from "../../shared/utils/formatJson";

export class CityController {
  private readonly cityUseCases: CityUseCases;

  constructor(cityUseCases: CityUseCases) {
    this.cityUseCases = cityUseCases;
  }

  createCity = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const cityData = req.body;
      const createdCity = await this.cityUseCases.createCity(cityData);

      res.status(201).json(
        formatJson({
          data: createdCity,
          message: "City created successfully",
          status: true
        }),
      );
    },
  );

  getAllCities = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { data, pagination } = await this.cityUseCases.getCities(req.query as Record<string, any>);

      res.status(200).json(
        formatJson({
          data: {
            list: data,
            paginationResult: pagination,
          },
          message: "Cities fetched successfully",
          status: true,
        }),
      );
    },
  );

  getCityById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const cityId = req.params.id as string;
      const city = await this.cityUseCases.getCityById(cityId);

      res.status(200).json(
        formatJson({
          data: city,
          message: "City fetched successfully",
          status: true,
        }),
      );
    },
  );

  deleteCityById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const cityId = req.params.id as string;
      const deletedCity = await this.cityUseCases.deleteCityById(cityId);

      res.status(200).json(
        formatJson({
          data: deletedCity,
          message: "City deleted successfully",
          status: true,
        }),
      );
    },
  );
}
