import { Request, Response, NextFunction } from "express";
import * as projectsService from "../service/projects.service.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

export const getProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const projects = await projectsService.getAccessibleProjects(req.user!.id);
    res.status(200).json(new ApiResponse(200, projects, "Projects retrieved."));
  } catch (error) {
    next(error);
  }
};

export const getProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const project = await projectsService.getProjectById(
      req.params.id as string,
      req.user!.id
    );
    res.status(200).json(new ApiResponse(200, project, "Project retrieved."));
  } catch (error) {
    next(error);
  }
};

export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const project = await projectsService.createProject(req.body, req.user!.id);
    res.status(201).json(new ApiResponse(201, project, "Project created."));
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const project = await projectsService.updateProject(
      req.params.id as string,
      req.body,
      req.user!.id
    );
    res.status(200).json(new ApiResponse(200, project, "Project updated."));
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await projectsService.deleteProject(req.params.id as string, req.user!.id);
    res.status(200).json(new ApiResponse(200, null, "Project deleted."));
  } catch (error) {
    next(error);
  }
};

export const addMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const member = await projectsService.addMember(
      req.params.id as string,
      req.body, // contains { userId? } or { email? }
      req.user!.id
    );
    res.status(201).json(new ApiResponse(201, member, "Member added."));
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await projectsService.removeMember(
      req.params.id as string,
      req.params.userId as string,
      req.user!.id
    );
    res.status(200).json(new ApiResponse(200, null, "Member removed."));
  } catch (error) {
    next(error);
  }
};
