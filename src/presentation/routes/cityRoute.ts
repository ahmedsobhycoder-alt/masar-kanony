import { Router } from "express";

import { CityController } from "../controllers/cityController";
import { CityUseCases } from "../../domain/usecases/cityUseCases";
import { createCityValidator, getCityByIdValidator } from "../validators/cityValidator";
import cityRepoImpl from "../../infrastructure/database/repositories/cityRepoImpl";

const cityRouter = Router();
const cityController = new CityController(
  new CityUseCases({ cityRepo: cityRepoImpl }),
);

cityRouter
  .post("/", createCityValidator, cityController.createCity)
  .get("/", cityController.getAllCities)
  .get("/:id", getCityByIdValidator, cityController.getCityById)
  .delete("/:id", getCityByIdValidator, cityController.deleteCityById);

export default cityRouter;
