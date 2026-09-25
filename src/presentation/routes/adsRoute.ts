import { Router } from "express";

import { AdsController } from "../controllers/adsController";
import { AdsUseCases } from "../../domain/usecases/adsUseCases";
import { createAdValidator , deleteByIdValidator} from "../validators/adsValidator";
import adsRepoImpl from "../../infrastructure/database/repositories/adsRepoImpl";
import  uploadSingleImageAndDoIMageProcessing  from "../middlewares/imageProcessingMiddleware";
const adsRouter = Router();
const adsController = new AdsController(
  new AdsUseCases({ adsRepo: adsRepoImpl })
);

adsRouter
  .post("/", uploadSingleImageAndDoIMageProcessing("image", "public/uploads/ads") ,createAdValidator,adsController.createAd)
  .get("/", adsController.getAllAds)
  .get("/:id", adsController.getAdById)
  .delete("/:id",deleteByIdValidator, adsController.deleteAdById);

export default adsRouter;
