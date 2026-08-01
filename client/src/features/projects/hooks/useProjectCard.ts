import { useAuthStore } from "@/store/authStore";
import type { Project } from "../api/projects.api";

export const useProjectCard = (project: Project) => {
  const { user } = useAuthStore();
  const isOwner = user?.id === project.ownerId;
  return { state: { isOwner } };
};
