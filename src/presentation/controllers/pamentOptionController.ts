import PaymentOptionUseCases
 from "../../domain/usecases/paymentOptionUseCases";
 import paymentOptionRepoImpl
  from "../../infrastructure/database/repositories/paymentOptionRepoImpl";
  import PaymentOptionEntity
   from "../../domain/entities/paymentOption";
import asyncHandler from "express-async-handler";
import { formatJson } from "../../shared/utils/formatJson";

import { Request, Response, NextFunction } from "express";
import { printBlue } from "../../shared/utils/printColors";

class PaymentOptionController{
   readonly paymentOptionUseCases: PaymentOptionUseCases;
    constructor(paymentOptionUseCases: PaymentOptionUseCases) {
        this.paymentOptionUseCases = paymentOptionUseCases;
    }
createPaymentOption = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    printBlue("req.body", JSON.stringify(req.body));
    const paymentOptionData = req.body;
    const createdPaymentOption = await this.paymentOptionUseCases.createPaymentOption(paymentOptionData);
    
    // Add return here
     res.status(201).json(formatJson({ 
        data: createdPaymentOption, 
        message: req.t("Payment option created successfully", { ns: "common" }), 
        status: true 
    }));
});
    getPaymentOptions = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { data, pagination } = await this.paymentOptionUseCases.getPaymentOptions(req.query as Record<string, any>);
        res.status(200).json(formatJson({ data: { list: data, paginationResult: pagination }, message: req.t("Payment options fetched successfully", { ns: "common" }), status: true }));
    });

}
export default PaymentOptionController;