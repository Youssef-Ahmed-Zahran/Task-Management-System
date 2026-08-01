import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from "../api/tasks.api";
import type { Task, TaskStatus, Priority } from "../api/tasks.api";
import type { CreateTaskFormValues } from "../schemas/tasks.schema";

export const useTaskBoard = (projectId: string) => {
  const [filters, setFilters] = useState<{
    status?: TaskStatus;
    priority?: Priority;
    assigneeId?: string;
    search?: string;
  }>({});
  const [showFilters, setShowFilters] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>("TODO");
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    setFilters((f) => {
      const newFilters = { ...f };
      if (debouncedSearch) {
        newFilters.search = debouncedSearch;
      } else {
        delete newFilters.search;
      }
      return newFilters;
    });
  }, [debouncedSearch]);

  const { data: tasks, isLoading, isError, error } = useTasks(projectId, filters);
  const { mutate: createTask, isPending: isCreating } =
    useCreateTask(projectId);
  const { mutate: updateTask, isPending: isUpdating } =
    useUpdateTask(projectId);
  const { mutate: deleteTask } = useDeleteTask(projectId);

  const handleCreate = (data: CreateTaskFormValues) => {
    const payload = {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
    };
    createTask(payload as any, { onSuccess: () => setShowForm(false) });
  };

  const handleUpdate = (data: CreateTaskFormValues) => {
    if (!editingTask) return;
    const payload = {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
    };
    updateTask(
      { taskId: editingTask.id, data: payload as any },
      { onSuccess: () => setEditingTask(null) },
    );
  };

  const handleDelete = (task: Task) => {
    if (!window.confirm(`Delete task "${task.title}"?`)) return;
    deleteTask(task.id);
  };

  const handleStatusChange = (task: Task, newStatus: TaskStatus) => {
    updateTask({ taskId: task.id, data: { status: newStatus } });
  };

  const openCreateForColumn = (status: TaskStatus) => {
    setDefaultStatus(status);
    setShowForm(true);
  };

  const hasFilters = Object.values(filters).some(Boolean);

  return {
    state: {
      filters,
      setFilters,
      showFilters,
      setShowFilters,
      showForm,
      setShowForm,
      editingTask,
      setEditingTask,
      defaultStatus,
      searchInput,
      setSearchInput,
      hasFilters,
    },
    query: {
      tasks,
      isLoading,
      isError,
      error,
    },
    actions: {
      handleCreate,
      handleUpdate,
      handleDelete,
      handleStatusChange,
      openCreateForColumn,
      isCreating,
      isUpdating,
    },
  };
};
