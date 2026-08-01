import { z } from "zod";
import { TaskStatus, Priority } from "@prisma/client";

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Task title is required").max(300),
    description: z.string().max(2000).optional(),
    status: z.nativeEnum(TaskStatus).default(TaskStatus.TODO),
    priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
    dueDate: z.string().datetime({ offset: true }).optional().nullable(),
    assigneeId: z.string().optional().nullable(),
  }),
  params: z.object({ projectId: z.string() }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(300).optional(),
    description: z.string().max(2000).optional().nullable(),
    status: z.nativeEnum(TaskStatus).optional(),
    priority: z.nativeEnum(Priority).optional(),
    dueDate: z.string().datetime({ offset: true }).optional().nullable(),
    assigneeId: z.string().optional().nullable(),
  }),
  params: z.object({ projectId: z.string(), taskId: z.string() }),
});

export const listTasksQuerySchema = z.object({
  query: z.object({
    status: z.nativeEnum(TaskStatus).optional(),
    priority: z.nativeEnum(Priority).optional(),
    assigneeId: z.string().optional(),
    search: z.string().optional(),
  }),
  params: z.object({ projectId: z.string() }),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>["body"];
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>["body"];
export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>["query"];
