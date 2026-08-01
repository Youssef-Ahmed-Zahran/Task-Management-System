import api from "@/config/axios";
import type { AuthUser } from "@/store/authStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    api.post<ApiResponse<AuthUser>>("/auth/register", payload),

  login: (payload: LoginPayload) =>
    api.post<ApiResponse<AuthUser>>("/auth/login", payload),

  logout: () => api.post<ApiResponse<null>>("/auth/logout"),

  getMe: () => api.get<ApiResponse<AuthUser>>("/auth/me"),
};

interface UseMeOptions {
  enabled?: boolean;
  onSuccess?: (data: any) => void;
}

export const useMe = (options?: UseMeOptions) => {
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);
  const navigate = useNavigate();
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        const res = await authApi.getMe();
        setUser(res.data.data);
        options?.onSuccess?.(res.data);
        return res.data;
      } catch (err: any) {
        // If the session cookie is invalid/expired, clear persisted state and redirect
        if (err?.response?.status === 401) {
          clearUser();
          navigate("/login", { replace: true });
        }
        throw err;
      }
    },
    enabled: options?.enabled ?? true,
    retry: false,
    staleTime: 0,
  });
};

export const useLogin = () => {
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const res = await authApi.login(payload);
      return res.data;
    },
    onSuccess: (data) => {
      setUser(data.data);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const res = await authApi.register(payload);
      return res.data;
    },
  });
};

export const useLogout = () => {
  const clearUser = useAuthStore((s) => s.clearUser);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await authApi.logout();
      return res.data;
    },
    onSuccess: () => {
      // Clear ALL cached query data so the next user starts fresh.
      // Without this, a member logging in after an admin would see
      // the admin's cached projects until a hard refresh.
      queryClient.clear();
      clearUser();
    },
  });
};
