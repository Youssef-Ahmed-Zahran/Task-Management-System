import { Request, Response, NextFunction } from "express";
import * as tasksService from "../service/tasks.service.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

export const listTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tasks = await tasksService.listTasks(
      req.params.projectId as string,
      req.user!.id,
      req.query as any
    );
    res.status(200).json(new ApiResponse(200, tasks, "Tasks retrieved."));
  } catch (error) {
    next(error);
  }
};

export const getTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const task = await tasksService.getTask(
      req.params.projectId as string,
      req.params.taskId as string,
      req.user!.id
    );
    res.status(200).json(new ApiResponse(200, task, "Task retrieved."));
  } catch (error) {
    next(error);
  }
};

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const task = await tasksService.createTask(
      req.params.projectId as string,
      req.body,
      req.user!.id
    );
    res.status(201).json(new ApiResponse(201, task, "Task created."));
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const task = await tasksService.updateTask(
      req.params.projectId as string,
      req.params.taskId as string,
      req.body,
      req.user!.id
    );
    res.status(200).json(new ApiResponse(200, task, "Task updated."));
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await tasksService.deleteTask(
      req.params.projectId as string,
      req.params.taskId as string,
      req.user!.id
    );
    res.status(200).json(new ApiResponse(200, null, "Task deleted."));
  } catch (error) {
    next(error);
  }
};
