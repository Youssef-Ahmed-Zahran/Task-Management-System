import api from "@/config/axios";
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type Priority = "LOW" | "MEDIUM" | "HIGH";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  creator: { id: string; name: string; email: string };
  assignee: { id: string; name: string; email: string } | null;
  project: { id: string; name: string };
}

export interface TaskDetail extends Task {
  auditLogs: Array<{
    id: string;
    field: string;
    oldValue: string | null;
    newValue: string | null;
    changedAt: string;
    user: { id: string; name: string };
  }>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: Priority;
  assigneeId?: string;
  search?: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  dueDate?: string | null;
  assigneeId?: string | null;
}

export const tasksApi = {
  getAll: (projectId: string, filters?: TaskFilters) =>
    api.get<ApiResponse<Task[]>>(`/projects/${projectId}/tasks`, {
      params: filters,
    }),

  getById: (projectId: string, taskId: string) =>
    api.get<ApiResponse<TaskDetail>>(`/projects/${projectId}/tasks/${taskId}`),

  create: (projectId: string, data: CreateTaskPayload) =>
    api.post<ApiResponse<Task>>(`/projects/${projectId}/tasks`, data),

  update: (projectId: string, taskId: string, data: Partial<CreateTaskPayload>) =>
    api.put<ApiResponse<Task>>(`/projects/${projectId}/tasks/${taskId}`, data),

  delete: (projectId: string, taskId: string) =>
    api.delete<ApiResponse<null>>(`/projects/${projectId}/tasks/${taskId}`),
};

export const tasksKey = (projectId: string) => ["tasks", projectId] as const;
export const taskKey = (projectId: string, taskId: string) =>
  ["tasks", projectId, taskId] as const;

export const useTasks = (projectId: string, filters?: TaskFilters) =>
  useQuery({
    queryKey: [...tasksKey(projectId), filters],
    queryFn: async () => {
      const res = await tasksApi.getAll(projectId, filters);
      return res.data.data;
    },
    enabled: !!projectId,
    placeholderData: keepPreviousData,
  });

export const useTask = (projectId: string, taskId: string) =>
  useQuery({
    queryKey: taskKey(projectId, taskId),
    queryFn: async () => {
      const res = await tasksApi.getById(projectId, taskId);
      return res.data.data;
    },
    enabled: !!projectId && !!taskId,
  });

export const useCreateTask = (projectId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateTaskPayload) => {
      const res = await tasksApi.create(projectId, data);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: tasksKey(projectId) }),
  });
};

export const useUpdateTask = (projectId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      taskId,
      data,
    }: {
      taskId: string;
      data: Partial<CreateTaskPayload>;
    }) => {
      const res = await tasksApi.update(projectId, taskId, data);
      return res.data.data;
    },
    onSuccess: (_, { taskId }) => {
      qc.invalidateQueries({ queryKey: tasksKey(projectId) });
      qc.invalidateQueries({ queryKey: taskKey(projectId, taskId) });
    },
  });
};

export const useDeleteTask = (projectId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (taskId: string) => {
      await tasksApi.delete(projectId, taskId);
      return taskId;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: tasksKey(projectId) }),
  });
};
