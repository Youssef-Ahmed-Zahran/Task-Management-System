import api from "@/config/axios";
import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "@/features/projects/api/projects.api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export const usersApi = {
  getAll: () => api.get<ApiResponse<User[]>>("/users"),
};

export const USERS_KEY = ["users"] as const;

export const useUsers = () =>
  useQuery({
    queryKey: USERS_KEY,
    queryFn: async () => {
      const res = await usersApi.getAll();
      return res.data.data;
    },
  });
