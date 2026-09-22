import { Router } from "express";

import { AdsController } from "../controllers/adsController";
import { AdsUseCases } from "../../domain/usecases/adsUseCases";
import { createAdValidator } from "../validators/adsValidator";
import adsRepoImpl from "../../infrastructure/database/repositories/adsRepoImpl";

const adsRouter = Router();
const adsController = new AdsController(
  new AdsUseCases({ adsRepo: adsRepoImpl })
);

adsRouter
  .post("/", createAdValidator, adsController.createAd)
  .get("/", adsController.getAllAds)
  .get("/:id", adsController.getAdById);

export default adsRouter;
