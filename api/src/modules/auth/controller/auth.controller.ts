import { Request, Response, NextFunction } from "express";
import * as authService from "../service/auth.service.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { env } from "../../../config/env.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await authService.registerUser(req.body);
    res
      .status(201)
      .json(new ApiResponse(201, user, "Account created successfully."));
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { user, token } = await authService.loginUser(req.body);
    res
      .cookie("access_token", token, COOKIE_OPTIONS)
      .status(200)
      .json(new ApiResponse(200, user, "Logged in successfully."));
  } catch (error) {
    next(error);
  }
};

export const logout = (
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res
    .clearCookie("access_token", COOKIE_OPTIONS)
    .status(200)
    .json(new ApiResponse(200, null, "Logged out successfully."));
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await authService.getMe(req.user!.id);
    res.status(200).json(new ApiResponse(200, user, "User retrieved."));
  } catch (error) {
    next(error);
  }
};
