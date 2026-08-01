import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from "../api/projects.api";
import type { Project } from "../api/projects.api";

export const useProjectsPage = () => {
  const { data: projects, isLoading, isError, error } = useProjects();
  const { mutate: createProject, isPending: isCreating } = useCreateProject();
  const { mutate: deleteProject } = useDeleteProject();

  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject(
    editingProject?.id ?? "",
  );

  const handleCreate = (data: { name: string; description?: string }) => {
    createProject(data, { onSuccess: () => setShowForm(false) });
  };

  const handleUpdate = (data: { name: string; description?: string }) => {
    if (!editingProject) return;
    updateProject(data, { onSuccess: () => setEditingProject(null) });
  };

  const handleDelete = (project: Project) => {
    if (!window.confirm(`Delete "${project.name}"? This cannot be undone.`))
      return;
    deleteProject(project.id);
  };

  const filtered = projects?.filter((p) =>
    p.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  return {
    state: {
      showForm,
      setShowForm,
      editingProject,
      setEditingProject,
      search,
      setSearch,
    },
    query: {
      projects,
      filtered,
      isLoading,
      isError,
      error,
    },
    actions: {
      handleCreate,
      handleUpdate,
      handleDelete,
      isCreating,
      isUpdating,
    },
  };
};
