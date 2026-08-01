import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(300),
  description: z.string().max(2000).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  dueDate: z.string().optional().nullable(),
  assigneeId: z.string().optional().nullable(),
});

export type CreateTaskFormValues = z.infer<typeof createTaskSchema>;
