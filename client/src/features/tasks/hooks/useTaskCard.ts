import { useAuthStore } from "@/store/authStore";
import type { Task } from "../api/tasks.api";
import { isOverdue } from "@/utils/formatDate";

export const useTaskCard = (task: Task) => {
  const { user } = useAuthStore();
  const canModify = user?.id === task.creator.id || user?.role === "ADMIN";
  const overdue = isOverdue(task.dueDate);

  return { state: { canModify, overdue } };
};
