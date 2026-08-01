import { Request, Response, NextFunction } from "express";
import * as usersService from "../service/users.service.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

export const getAllUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await usersService.getAllUsers();
    res.status(200).json(new ApiResponse(200, users, "Users retrieved."));
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await usersService.getUserById(req.params.id as string);
    res.status(200).json(new ApiResponse(200, user, "User retrieved."));
  } catch (error) {
    next(error);
  }
};
