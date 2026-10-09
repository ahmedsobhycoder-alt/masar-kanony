import { Router } from "express";

import { HomeController } from "../controllers/homeController";
import { HomeUseCases } from "../../domain/usecases/homeUseCases";
import HomeRepoImpl from "../../infrastructure/database/repositories/homeRepoImpl";
import { optionalProtect } from "../middlewares/authMiddleware";

const homeRouter = Router();
const homeController = new HomeController(
  new HomeUseCases({ homeRepo:new  HomeRepoImpl() })
);

homeRouter.get("/",optionalProtect, homeController.getHomeData);

export default homeRouter;
