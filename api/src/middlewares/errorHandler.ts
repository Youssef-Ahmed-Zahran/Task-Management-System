import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
      ...(env.NODE_ENV === "development" && { stack: err.stack }),
    });
    return;
  }

  // Prisma unique constraint violation
  if ((err as any).code === "P2002") {
    res.status(409).json({
      success: false,
      statusCode: 409,
      message: "A record with this value already exists.",
      errors: [],
    });
    return;
  }

  // Prisma record not found
  if ((err as any).code === "P2025") {
    res.status(404).json({
      success: false,
      statusCode: 404,
      message: "Record not found.",
      errors: [],
    });
    return;
  }

  console.error("Unhandled Error:", err);

  res.status(500).json({
    success: false,
    statusCode: 500,
    message: "Internal server error.",
    errors: [],
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
