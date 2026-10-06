import { Router } from "express";

import { HomeController } from "../controllers/homeController";
import { HomeUseCases } from "../../domain/usecases/homeUseCases";
import HomeRepoImpl from "../../infrastructure/database/repositories/homeRepoImpl";

const homeRouter = Router();
const homeController = new HomeController(
  new HomeUseCases({ homeRepo:new  HomeRepoImpl() })
);

homeRouter.get("/", homeController.getHomeData);

export default homeRouter;
