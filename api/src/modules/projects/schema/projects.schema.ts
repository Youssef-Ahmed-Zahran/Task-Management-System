import { z } from "zod";

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Project name is required").max(200),
    description: z.string().max(1000).optional(),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200).optional(),
    description: z.string().max(1000).optional(),
  }),
  params: z.object({ id: z.string() }),
});

export const addMemberSchema = z.object({
  body: z.object({
    // Accept either a userId or an email address
    userId: z.string().min(1).optional(),
    email: z.string().email().optional(),
  }).refine((data) => data.userId || data.email, {
    message: "Either userId or email is required",
  }),
  params: z.object({ id: z.string() }),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>["body"];
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>["body"];
