import { prisma } from "../../../lib/prisma.js";
import { ApiError } from "../../../utils/ApiError.js";
import type { CreateTaskInput, UpdateTaskInput, ListTasksQuery } from "../schema/tasks.schema.js";
import { TaskStatus } from "@prisma/client";

const taskSelect = {
  id: true,
  title: true,
  description: true,
  status: true,
  priority: true,
  dueDate: true,
  createdAt: true,
  updatedAt: true,
  creator: { select: { id: true, name: true, email: true } },
  assignee: { select: { id: true, name: true, email: true } },
  project: { select: { id: true, name: true } },
};

const assertProjectAccess = async (projectId: string, userId: string) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      ownerId: true,
      members: { select: { userId: true } },
    },
  });

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const hasAccess =
    project.ownerId === userId ||
    project.members.some((m) => m.userId === userId);

  if (!hasAccess) {
    throw new ApiError(403, "You do not have access to this project.");
  }

  return project;
};

export const listTasks = async (
  projectId: string,
  userId: string,
  query: ListTasksQuery
) => {
  await assertProjectAccess(projectId, userId);

  return prisma.task.findMany({
    where: {
      projectId,
      ...(query.status && { status: query.status }),
      ...(query.priority && { priority: query.priority }),
      ...(query.assigneeId && { assigneeId: query.assigneeId }),
      ...(query.search && {
        OR: [
          { title: { contains: query.search, mode: "insensitive" } },
          { description: { contains: query.search, mode: "insensitive" } },
        ],
      }),
    },
    select: taskSelect,
    orderBy: { createdAt: "desc" },
  });
};

export const getTask = async (
  projectId: string,
  taskId: string,
  userId: string
) => {
  await assertProjectAccess(projectId, userId);

  const task = await prisma.task.findFirst({
    where: { id: taskId, projectId },
    select: {
      ...taskSelect,
      auditLogs: {
        select: {
          id: true,
          field: true,
          oldValue: true,
          newValue: true,
          changedAt: true,
          user: { select: { id: true, name: true } },
        },
        orderBy: { changedAt: "desc" },
      },
    },
  });

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  return task;
};

export const createTask = async (
  projectId: string,
  data: CreateTaskInput,
  creatorId: string
) => {
  await assertProjectAccess(projectId, creatorId);

  return prisma.task.create({
    data: {
      projectId,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      assigneeId: data.assigneeId ?? null,
      creatorId,
    },
    select: taskSelect,
  });
};

export const updateTask = async (
  projectId: string,
  taskId: string,
  data: UpdateTaskInput,
  userId: string
) => {
  await assertProjectAccess(projectId, userId);

  const existing = await prisma.task.findFirst({
    where: { id: taskId, projectId },
  });

  if (!existing) {
    throw new ApiError(404, "Task not found.");
  }

  // Build audit log entries for changed fields
  const auditEntries: {
    taskId: string;
    userId: string;
    field: string;
    oldValue: string | null;
    newValue: string | null;
  }[] = [];

  if (data.status && data.status !== existing.status) {
    auditEntries.push({
      taskId,
      userId,
      field: "status",
      oldValue: existing.status,
      newValue: data.status,
    });
  }

  if (data.assigneeId !== undefined && data.assigneeId !== existing.assigneeId) {
    auditEntries.push({
      taskId,
      userId,
      field: "assigneeId",
      oldValue: existing.assigneeId,
      newValue: data.assigneeId ?? null,
    });
  }

  const [updatedTask] = await prisma.$transaction([
    prisma.task.update({
      where: { id: taskId },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.status && { status: data.status }),
        ...(data.priority && { priority: data.priority }),
        ...(data.dueDate !== undefined && {
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
        }),
        ...(data.assigneeId !== undefined && { assigneeId: data.assigneeId }),
      },
      select: taskSelect,
    }),
    ...(auditEntries.length > 0
      ? [prisma.auditLog.createMany({ data: auditEntries })]
      : []),
  ]);

  return updatedTask;
};

export const deleteTask = async (
  projectId: string,
  taskId: string,
  userId: string
) => {
  const project = await assertProjectAccess(projectId, userId);

  const task = await prisma.task.findFirst({ where: { id: taskId, projectId } });

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  const isOwner = project.ownerId === userId;
  const isCreator = task.creatorId === userId;

  if (!isOwner && !isCreator) {
    throw new ApiError(403, "Only the task creator or project owner can delete this task.");
  }

  await prisma.task.delete({ where: { id: taskId } });
};
