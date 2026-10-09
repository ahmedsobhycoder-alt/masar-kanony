// src/presentation/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import ApiError from "../../shared/errors/apiError";
import UserModel from "../../infrastructure/database/models/userModel";
import { printBlue } from "../../shared/utils/printColors";
import UserEntity from "../../domain/entities/userEntity";

interface JwtPayloadCustom {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ApiError(401, req.t("unauthorized", { ns: "errors" })));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayloadCustom;

  const currentUser = await UserModel.findById(decoded.id).lean();
  if (!currentUser) {
    return next(new ApiError(401, req.t("user_not_found", { ns: "errors" })));
  }

  if (currentUser.passwordChangedAt) {
    const passChangedSeconds = Math.floor(currentUser.passwordChangedAt.getTime() / 1000);
    if (passChangedSeconds > decoded.iat) {
      return next(new ApiError(401, req.t("password_changed", { ns: "errors" })));
    }
  }

  // Attach currentUser to req.user
  (req as any).user = currentUser as UserEntity;
  printBlue("req.user", (req as any).user);
  next();
});
export const optionalProtect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 1. If no token is provided, proceed as guest
  if (!token) {
    (req as any).user = null;
    (req as any).userId = null;
    return next();
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayloadCustom;

    // 3. Find user in DB
    const currentUser = await UserModel.findById(decoded.id).lean();
    if (!currentUser) {
      (req as any).user = null;
      (req as any).userId = null;
      return next();
    }

    // 4. Verify password was not changed after token was issued
    if (currentUser.passwordChangedAt) {
      const passChangedSeconds = Math.floor(new Date(currentUser.passwordChangedAt).getTime() / 1000);
      if (passChangedSeconds > decoded.iat) {
        (req as any).user = null;
        (req as any).userId = null;
        return next();
      }
    }

    // 5. Attach authenticated user
    (req as any).user = currentUser as UserEntity;
    (req as any).userId = (currentUser as any)._id.toString();
    return next();
  } catch (error) {
    // Token is invalid, expired, or malformed -> treat as unauthenticated guest
    (req as any).user = null;
    (req as any).userId = null;
    return next();
  }
});
export const allowedTo = (roles: string[]) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    printBlue("roles", roles);
    printBlue("req.user.role", user?.role);

    if (!user || !roles.includes(user.role)) {
      return next(new ApiError(403, req.t("forbidden", { ns: "errors" })));
    }
    next();
  });