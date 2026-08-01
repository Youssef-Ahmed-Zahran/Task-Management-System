import api from "@/config/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Project {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner: { id: string; name: string; email: string };
  members: Array<{
    user: { id: string; name: string; email: string; role: string };
    joinedAt: string;
  }>;
  _count: { tasks: number };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const projectsApi = {
  getAll: () => api.get<ApiResponse<Project[]>>("/projects"),

  getById: (id: string) => api.get<ApiResponse<Project>>(`/projects/${id}`),

  create: (data: { name: string; description?: string }) =>
    api.post<ApiResponse<Project>>("/projects", data),

  update: (id: string, data: { name?: string; description?: string }) =>
    api.put<ApiResponse<Project>>(`/projects/${id}`, data),

  delete: (id: string) => api.delete<ApiResponse<null>>(`/projects/${id}`),

  addMember: (id: string, email: string) =>
    api.post<ApiResponse<any>>(`/projects/${id}/members`, { email }),

  removeMember: (id: string, userId: string) =>
    api.delete<ApiResponse<null>>(`/projects/${id}/members/${userId}`),
};

export const PROJECTS_KEY = ["projects"] as const;
export const projectKey = (id: string) => ["projects", id] as const;

export const useProjects = () =>
  useQuery({
    queryKey: PROJECTS_KEY,
    queryFn: async () => {
      const res = await projectsApi.getAll();
      return res.data.data;
    },
  });

export const useProject = (id: string) =>
  useQuery({
    queryKey: projectKey(id),
    queryFn: async () => {
      const res = await projectsApi.getById(id);
      return res.data.data;
    },
    enabled: !!id,
  });

export const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const res = await projectsApi.create(data);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: PROJECTS_KEY }),
  });
};

export const useUpdateProject = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name?: string; description?: string }) => {
      const res = await projectsApi.update(id, data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROJECTS_KEY });
      qc.invalidateQueries({ queryKey: projectKey(id) });
    },
  });
};

export const useDeleteProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await projectsApi.delete(id);
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: PROJECTS_KEY }),
  });
};

export const useAddMember = (projectId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await projectsApi.addMember(projectId, userId);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: projectKey(projectId) }),
  });
};

export const useRemoveMember = (projectId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      await projectsApi.removeMember(projectId, userId);
      return userId;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: projectKey(projectId) }),
  });
};
