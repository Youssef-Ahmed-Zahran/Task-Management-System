import { Plus, FolderKanban, Search } from "lucide-react";
import ProjectCard from "../components/ProjectCard";
import ProjectForm from "../components/ProjectForm";
import Loader from "@/components/loader/Loader";
import { useProjectsPage } from "../hooks/useProjectsPage";
import { useAuthStore } from "@/store/authStore";

const ProjectsPage = () => {
  const { state, query, actions } = useProjectsPage();
  const { user } = useAuthStore();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-sm text-gray-500 mt-0.5">
            {query.projects?.length ?? 0} project
            {query.projects?.length !== 1 ? "s" : ""} accessible
          </p>
        </div>
        {user?.role === "ADMIN" && (
          <button
            onClick={() => state.setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        )}
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          value={state.search}
          onChange={(e) => state.setSearch(e.target.value)}
          placeholder="Search projects..."
          className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>

      {/* Content */}
      {query.isLoading ? (
        <Loader />
      ) : query.isError ? (
        <div className="text-center py-16 text-red-400">
          <p className="font-semibold">Failed to load projects.</p>
          <p className="text-sm mt-1 text-red-300 opacity-70">
            {(query.error as any)?.response?.data?.message ||
              (query.error as any)?.message ||
              "Unknown error"}
          </p>
        </div>
      ) : query.filtered?.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FolderKanban className="w-7 h-7 text-gray-600" />
          </div>
          <h3 className="text-base font-medium text-gray-400 mb-1">
            {state.search ? "No projects match your search" : "No projects yet"}
          </h3>
          <p className="text-sm text-gray-600">
            {state.search
              ? "Try a different search term"
              : "Create your first project to get started"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {query.filtered?.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={state.setEditingProject}
              onDelete={actions.handleDelete}
            />
          ))}
        </div>
      )}

      {/* Create modal */}
      {state.showForm && (
        <ProjectForm
          title="New Project"
          onSubmit={actions.handleCreate}
          isPending={actions.isCreating}
          onCancel={() => state.setShowForm(false)}
        />
      )}

      {/* Edit modal */}
      {state.editingProject && (
        <ProjectForm
          title="Edit Project"
          defaultValues={{
            name: state.editingProject.name,
            description: state.editingProject.description ?? "",
          }}
          onSubmit={actions.handleUpdate}
          isPending={actions.isUpdating}
          onCancel={() => state.setEditingProject(null)}
        />
      )}
    </div>
  );
};

export default ProjectsPage;
