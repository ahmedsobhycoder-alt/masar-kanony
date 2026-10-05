// src/presentation/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import ApiError from "../../shared/errors/apiError";
import UserModel from "../../infrastructure/database/models/userModel";
import { printBlue } from "../../shared/utils/printColors";

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
    return next(new ApiError(401, "Unauthorized"));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayloadCustom;

  const currentUser = await UserModel.findById(decoded.id);
  if (!currentUser) {
    return next(new ApiError(401, "Unauthorized, user not found"));
  }

  if (currentUser.passwordChangedAt) {
    const passChangedSeconds = Math.floor(currentUser.passwordChangedAt.getTime() / 1000);
    if (passChangedSeconds > decoded.iat) {
      return next(new ApiError(401, "login again, password changed"));
    }
  }

  // Attach currentUser to req.user
  (req as any).user = currentUser;
  printBlue("req.user", (req as any).user);
  next();
});

export const allowedTo = (roles: string[]) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    printBlue("roles", roles);
    printBlue("req.user.role", user?.role);

    if (!user || !roles.includes(user.role)) {
      return next(new ApiError(403, "Forbidden, you are not allowed"));
    }
    next();
  });