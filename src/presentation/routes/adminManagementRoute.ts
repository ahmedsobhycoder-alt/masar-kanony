import { Router } from "express";
import asyncHandler from "express-async-handler";
import { body, query } from "express-validator";
import UserModel from "../../infrastructure/database/models/userModel";
import WalletModel from "../../infrastructure/database/models/paymentOptionModel";
import PaymentModel from "../../infrastructure/database/models/paymentModel";
import { protect, allowedTo } from "../middlewares/authMiddleware";
import validatorMiddleware from "../middlewares/validatorMiddleWare";
import { resourceIdValidator } from "../validators/adminResourceValidator";
import ApiError from "../../shared/errors/apiError";
import pickAllowedFields from "../../shared/utils/pickAllowedFields";

const router = Router();
router.use(protect, allowedTo(["admin"]));
const userFields = "name email phone role active verified isSubscribed currentsubscriptionStatus currentSubscriptionId createdAt updatedAt";
const paginationValidator = [
    query("page").optional().isInt({ min: 1, max: 1000000 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("search").optional().isString().isLength({ max: 100 }),
    validatorMiddleware,
];
const userValidator = (creating: boolean) => [
    body("name").optional(!creating).isString().bail().trim().isLength({ min: 2, max: 20 }),
    body("email").optional(!creating).isEmail().bail().trim().toLowerCase().isLength({ min: 11, max: 254 }),
    body("phone").optional(!creating).isString().bail().matches(/^01[0125]\d{8}$/),
    body("password").optional(!creating).isString().bail().isLength({ min: 8, max: 72 }),
    body("role").optional().isIn(["admin", "user"]),
    body("active").optional().isBoolean({ strict: true }),
    validatorMiddleware,
];
const walletValidator = (creating: boolean) => [
    body("paymentType").optional(!creating).isString().bail().trim().isLength({ min: 2, max: 50 }),
    body("phone").optional(!creating).isString().bail().matches(/^01[0125]\d{8}$/),
    body("active").optional().isBoolean({ strict: true }),
    validatorMiddleware,
];
const send = (res: any, data: any, status = 200) => res.status(status).json({ status: true, message: "Success", data });
const list = async (model: any, req: any, fields?: string) => {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const search = String(req.query.search || "").trim();
    const regex = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const keys = fields ? ["name", "email", "phone"] : ["paymentType", "phone"];
    const filter = search ? { $or: keys.map((key) => ({ [key]: { $regex: regex, $options: "i" } })) } : {};
    const [rows, total] = await Promise.all([
        model.find(filter).select(fields || "paymentType phone active createdAt updatedAt").sort({ createdAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit).lean(),
        model.countDocuments(filter),
    ]);
    return { list: rows, paginationResult: { page, limit, totalDocuments: total, numberOfPages: Math.ceil(total / limit) } };
};
router.get("/users/stats", asyncHandler(async (req, res) => {
    const [total, subscribed] = await Promise.all([UserModel.countDocuments(), UserModel.countDocuments({ isSubscribed: true })]);
    send(res, { total, subscribed, unsubscribed: total - subscribed });
}));
router.get("/users", paginationValidator, asyncHandler(async (req, res) => { send(res, await list(UserModel, req, userFields)); }));
router.get("/users/:id", resourceIdValidator, asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.params.id).select(`${userFields} profileImage`).lean();
    if (!user) throw new ApiError(404, "User not found");
    send(res, user);
}));
router.post("/users", userValidator(true), asyncHandler(async (req, res) => {
    const data = pickAllowedFields(req.body, ["name", "email", "phone", "password", "role", "active"]);
    if (await UserModel.exists({ $or: [{ email: data.email }, { phone: data.phone }] } as any)) throw new ApiError(400, "Email or phone already exists");
    const user = await UserModel.create({ ...data, verified: true } as any);
    send(res, await UserModel.findById(user._id).select(userFields).lean(), 201);
}));
router.put("/users/:id", resourceIdValidator, userValidator(false), asyncHandler(async (req, res) => {
    const data = pickAllowedFields(req.body, ["name", "email", "phone", "role", "active"]);
    if (!Object.keys(data).length) throw new ApiError(400, "At least one update field is required");
    if (req.params.id === (req as any).user._id.toString() && (data.active === false || (data.role && data.role !== "admin"))) {
        throw new ApiError(400, "You cannot block or demote your own account");
    }
    const user = await UserModel.findByIdAndUpdate(req.params.id, { $set: data }, { new: true, runValidators: true }).select(userFields).lean();
    if (!user) throw new ApiError(404, "User not found");
    send(res, user);
}));
router.get("/wallets/stats", asyncHandler(async (req, res) => {
    const [total, active, usage] = await Promise.all([
        WalletModel.countDocuments(), WalletModel.countDocuments({ active: { $ne: false } }),
        PaymentModel.aggregate([{ $group: { _id: "$walletType", count: { $sum: 1 } } }, { $sort: { count: -1, _id: 1 } }]),
    ]);
    send(res, { total, active, mostUsed: usage[0] || null, usage });
}));
router.get("/wallets", paginationValidator, asyncHandler(async (req, res) => { send(res, await list(WalletModel, req)); }));
router.post("/wallets", walletValidator(true), asyncHandler(async (req, res) => {
    send(res, await WalletModel.create(pickAllowedFields(req.body, ["paymentType", "phone", "active"])), 201);
}));
router.put("/wallets/:id", resourceIdValidator, walletValidator(false), asyncHandler(async (req, res) => {
    const data = pickAllowedFields(req.body, ["paymentType", "phone", "active"]);
    if (!Object.keys(data).length) throw new ApiError(400, "At least one update field is required");
    const wallet = await WalletModel.findByIdAndUpdate(req.params.id, { $set: data }, { new: true, runValidators: true });
    if (!wallet) throw new ApiError(404, "Wallet not found");
    send(res, wallet);
}));
router.delete("/wallets/:id", resourceIdValidator, asyncHandler(async (req, res) => {
    const wallet = await WalletModel.findByIdAndDelete(req.params.id);
    if (!wallet) throw new ApiError(404, "Wallet not found");
    send(res, wallet);
}));
router.use((error: any, req: any, res: any, next: any) => {
    if (error.code === 11000) return next(new ApiError(400, "Email, phone or wallet type already exists"));
    if (error.name === "ValidationError") return next(new ApiError(400, error.message));
    next(error);
});
export default router;
