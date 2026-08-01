import { X } from "lucide-react";
import { cn } from "@/utils/cn";
import { useProjectForm } from "../hooks/useProjectForm";
import { ProjectFormProps } from "../types/ProjectForm.types";

const ProjectForm = ({
  defaultValues,
  onSubmit,
  isPending,
  onCancel,
  title,
}: ProjectFormProps) => {
  const { form } = useProjectForm({ defaultValues });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-white transition p-1 rounded-lg hover:bg-gray-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Project Name <span className="text-red-400">*</span>
            </label>
            <input
              {...form.register("name")}
              placeholder="My Awesome Project"
              className={cn(
                "w-full px-4 py-2.5 bg-gray-800 border rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition",
                form.errors.name ? "border-red-500" : "border-gray-700",
              )}
            />
            {form.errors.name && (
              <p className="mt-1 text-xs text-red-400">
                {form.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Description
            </label>
            <textarea
              {...form.register("description")}
              placeholder="Describe the project..."
              rows={3}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white rounded-xl text-sm font-medium transition-colors"
            >
              {isPending && (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
