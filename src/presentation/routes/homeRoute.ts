import { Router } from "express";

import { HomeController } from "../controllers/homeController";
import { HomeUseCases } from "../../domain/usecases/homeUseCases";
import homeRepoImpl from "../../infrastructure/database/repositories/homeRepoImpl";

const homeRouter = Router();
const homeController = new HomeController(
  new HomeUseCases({ homeRepo: homeRepoImpl })
);

homeRouter.get("/", homeController.getHomeData);

export default homeRouter;
