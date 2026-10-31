import { Router } from "express";
import asyncHandler from "express-async-handler";
import { query } from "express-validator";
import AdminAuditLog from "../../infrastructure/database/models/adminAuditLogModel";
import { allowedTo, protect, requireSuperAdmin } from "../middlewares/authMiddleware";
import validatorMiddleware from "../middlewares/validatorMiddleWare";
import { resourceIdValidator } from "../validators/adminResourceValidator";
import { restoreAuditLog } from "../../shared/utils/adminAudit";
import ApiError from "../../shared/errors/apiError";

const router = Router();
router.use(protect, allowedTo(["admin"]), requireSuperAdmin);

router.get("/", [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("resource").optional().isIn(["court", "floor", "office"]),
  query("action").optional().isIn(["updated", "deleted"]),
  validatorMiddleware,
], asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 20);
  const filter: any = {};
  if (req.query.resource) filter.resource = req.query.resource;
  if (req.query.action) filter.action = req.query.action;
  const [list, totalDocuments] = await Promise.all([
    AdminAuditLog.find(filter).select("-before -after").sort({ createdAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    AdminAuditLog.countDocuments(filter),
  ]);
  res.json({ status: true, message: "Audit logs fetched successfully", data: { list, paginationResult: { page, limit, totalDocuments, numberOfPages: Math.ceil(totalDocuments / limit) } } });
}));

router.get("/:id", resourceIdValidator, asyncHandler(async (req, res) => {
  const log = await AdminAuditLog.findById(req.params.id).lean();
  if (!log) throw new ApiError(404, "Audit log not found");
  res.json({ status: true, message: "Audit log fetched successfully", data: log });
}));

router.post("/:id/restore", resourceIdValidator, asyncHandler(async (req, res) => {
  const log = await AdminAuditLog.findById(req.params.id);
  if (!log) throw new ApiError(404, "Audit log not found");
  const restored = await restoreAuditLog(log, (req as any).user);
  res.json({ status: true, message: "Item restored successfully", data: restored });
}));

export default router;

