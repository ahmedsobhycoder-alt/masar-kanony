import { createPaymentOptionValidator } from "../validators/paymentOptionValidator";
import { Router } from "express";
import PaymentOptionController from "../controllers/pamentOptionController";
import PaymentOptionUseCases from "../../domain/usecases/paymentOptionUseCases";
import paymentOptionRepoImpl from "../../infrastructure/database/repositories/paymentOptionRepoImpl";
import { allowedTo, protect } from "../middlewares/authMiddleware";
import UserRole from "../../shared/constants/user-roles.enum";

const paymentOptionRouter = Router();
const paymentOptionController = new PaymentOptionController(
    new PaymentOptionUseCases({ paymentOptionRepo: paymentOptionRepoImpl }),
);

paymentOptionRouter
    .post("/",protect,allowedTo([UserRole.ADMIN]), createPaymentOptionValidator, paymentOptionController.createPaymentOption)
    .get("/", paymentOptionController.getPaymentOptions);
export default paymentOptionRouter;