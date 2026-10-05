import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import PaymentUseCases from "../../domain/usecases/paymentUseCases";
import { formatJson } from "../../shared/utils/formatJson";
import { printBlue } from "../../shared/utils/printColors";
import PaymentEntity from "../../domain/entities/paymentEntity";
import PaymentStatus from "../../shared/constants/payment-status.enums";

class PaymentController {
    readonly paymentUseCases: PaymentUseCases;

    constructor(paymentUseCases: PaymentUseCases) {
        this.paymentUseCases = paymentUseCases;
    }

    createPayment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        printBlue("req.body", JSON.stringify(req.body));
        const paymentData = req.body;
        printBlue("req.user", (req as any).user.id);
        paymentData.user = (req as any).user?.id as any; // Assuming req.user is populated by authentication middleware
        paymentData.status =PaymentStatus.PENDING; // Set default status to PENDING
        const createdPayment = await this.paymentUseCases.createPayment(paymentData);

        res.status(201).json(
            formatJson({
                data: createdPayment,
                message: "Payment created successfully",
                status: true,
            })
        );
    });

    getPayments = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { data, pagination } = await this.paymentUseCases.getPayments(
            req.query as Record<string, any>
        );

        res.status(200).json(
            formatJson({
                data: { list: data, paginationResult: pagination },
                message: "Payments fetched successfully",
                status: true,
            })
        );
    });

    getPaymentById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params as Record<string, any>;
        const payment = await this.paymentUseCases.getPaymentById(id);

        res.status(200).json(
            formatJson({
                data: payment,
                message: "Payment fetched successfully",
                status: true,
            })
        );
    });
    approvePayment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params as Record<string, any>;
        const approvedPayment = await this.paymentUseCases.approvePayment(id);

        res.status(200).json(
            formatJson({
                data: approvedPayment,
                message: "Payment approved successfully",
                status: true,
            })
        );
    });
    declinePayment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params as Record<string, any>;
        const declinedPayment = await this.paymentUseCases.declinePayment(id);

        res.status(200).json(
            formatJson({
                data: declinedPayment,
                message: "Payment declined successfully",
                status: true,
            })
        );
    });

    updatePaymentStatus = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { id } = req.params as Record<string, any>;
            const { status } = req.body;
            const updatedPayment = await this.paymentUseCases.updatePaymentStatus(id, status);

            res.status(200).json(
                formatJson({
                    data: updatedPayment,
                    message: "Payment status updated successfully",
                    status: true,
                })
            );
        }
    );

    deletePaymentById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params as Record<string, any>;
        const deletedPayment = await this.paymentUseCases.deletePaymentById(id);

        res.status(200).json(
            formatJson({
                data: deletedPayment,
                message: "Payment deleted successfully",
                status: true,
            })
        );
    });
}

export default PaymentController;