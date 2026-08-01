import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import { ApiError } from "../utils/ApiError.js";

export const authorize = (...roles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required."));
    }

    if (!roles.includes(req.user.role as Role)) {
      return next(
        new ApiError(403, "You do not have permission to perform this action.")
      );
    }

    next();
  };
};
